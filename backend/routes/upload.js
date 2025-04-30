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

    const { name, description, type, durations, status } = req.body;
    const imageUrl = req.file ? `/resources/images/uploads/${req.file.filename}` : null;

    if (type === 'borrow') {
        // Insert into borrowable_items table
        pool.query(
            'INSERT INTO borrowable_items (item_name, owner_id, image_url, status, item_description) VALUES (?, ?, ?, ?, ?)',
            [name, user.cms_id, imageUrl, true, description],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Failed to upload item' });
                }
                res.status(200).json({ message: 'Item uploaded successfully', itemId: result.insertId });
            }
        );
    } else if (type === 'trade') {
        // Insert into tradeable_items table with status
        pool.query(
            'INSERT INTO tradeable_items (item_name, owner_id, image_url, status, item_description, token_val) VALUES (?, ?, ?, ?, ?, ?)',
            [name, user.cms_id, imageUrl, status === 'available', description, 50], // Default token value set to 50
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