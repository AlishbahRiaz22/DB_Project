const routerUpload = require('express').Router();
const { pool } = require('../db_connection');
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/resources/images/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

routerUpload.post('/', upload.single('image'), (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, type, durations, status, tokenValue } = req.body;
    const imageUrl = req.file ? `./resources/images/uploads/${req.file.filename}` : null;

    if (type === 'borrow') {
        // Parse the durations JSON string to array
        let durationOptions = [];
        try {
            durationOptions = JSON.parse(durations);
            if (!Array.isArray(durationOptions) || durationOptions.length === 0) {
                return res.status(400).json({ error: 'At least one duration option is required' });
            }
        } catch (err) {
            console.error("Duration parsing error:", err);
            return res.status(400).json({ error: 'Invalid duration format' });
        }
    
        // Start a transaction to ensure data consistency
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Connection error:", err);
                return res.status(500).json({ error: 'Database connection failed' });
            }
    
            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    console.error("Transaction error:", err);
                    return res.status(500).json({ error: 'Failed to start transaction' });
                }
    
                // Insert into borrowable_items table
                connection.query(
                    'INSERT INTO borrowable_items (item_name, owner_id, image_url, status, item_description) VALUES (?, ?, ?, ?, ?)',
                    [name, user.cms_id, imageUrl, true, description],
                    (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error("Database error:", err);
                                res.status(500).json({ error: 'Failed to upload item' });
                            });
                        }
    
                        const itemId = result.insertId;
                        
                        // Insert durations into borrowable_item_durations table
                        const durationInsertPromises = durationOptions.map(days => {
                            return new Promise((resolve, reject) => {
                                connection.query(
                                    'INSERT INTO borrowable_item_durations (item_id, duration_days) VALUES (?, ?)',
                                    [itemId, parseInt(days)],
                                    (err, result) => {
                                        if (err) reject(err);
                                        else resolve(result);
                                    }
                                );
                            });
                        });
    
                        Promise.all(durationInsertPromises)
                            .then(() => {
                                connection.commit(err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.error("Commit error:", err);
                                            res.status(500).json({ error: 'Failed to save duration options' });
                                        });
                                    }
                                    
                                    connection.release();
                                    res.status(200).json({ 
                                        message: 'Item uploaded successfully', 
                                        itemId: itemId,
                                        durations: durationOptions 
                                    });
                                });
                            })
                            .catch(err => {
                                connection.rollback(() => {
                                    connection.release();
                                    console.error("Duration insert error:", err);
                                    res.status(500).json({ error: 'Failed to save duration options' });
                                });
                            });
                    }
                );
            });
    });
    } else if (type === 'trade') {
        // Validate tokenValue for tradeable items
        let parsedTokenValue = parseInt(tokenValue);
        
        if (isNaN(parsedTokenValue) || parsedTokenValue < 0) {
            return res.status(400).json({ error: 'Token value must be a positive number' });
        }
        
        // Insert into tradeable_items table with token value
        pool.query(
            'INSERT INTO tradeable_items (item_name, owner_id, image_url, status, item_description, token_val) VALUES (?, ?, ?, ?, ?, ?)',
            [name, user.cms_id, imageUrl, status === 'available', description, parsedTokenValue],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Failed to upload item' });
                }
                res.status(200).json({ message: 'Item uploaded successfully', itemId: result.insertId });
            }
        );
    }
});

exports.routerUpload = routerUpload;