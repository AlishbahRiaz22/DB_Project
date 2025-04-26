const routerBorrow = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerBorrow.post('/', (req, res, next) => {
    const item_id = req.body.item_id; // Extracting the item_id from request body
    const duration = req.body.duration; // Duration in days
    const reason = req.body.reason; // Reason for borrowing
    const owner_id = req.body.owner_id; // Owner of the item

    const user = req.session.user; // Getting the user from the session
    console.log("User in borrow route:", user); // Logging the user for debugging
    if (user === null || user === undefined) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    // Check if the item is available
    pool.query('SELECT * FROM borrowable_items WHERE item_id = ? AND status = 1', [item_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not available for borrowing' });
        }

        pool.query('SELECT * FROM borrow_req WHERE item_id = ? AND requester_id = ?', [item_id, user.cms_id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.length > 0) {
                return res.status(400).json({ error: 'You have already requested to borrow this item' });
            }
        });
        
        // Create a borrow request in the database
        pool.query(
            'INSERT INTO borrow_req (item_id, requester_id, borrow_dur, reason, owner_id, creation_date) VALUES (?, ?, ?, ?, ?, NOW())',
            [item_id, user.cms_id, duration, reason, owner_id],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Failed to create borrow request' });
                }
                
                return res.status(200).json({ message: 'Borrow request created successfully' });
            }
        );
    });
});

exports.routerBorrow = routerBorrow; // Exporting the routerBorrow object