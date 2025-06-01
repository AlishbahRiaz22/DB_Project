const routerNot = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerNot.get('/', (req, res, next) => {
    const user = req.session.user; // Getting the user from the session
    if (!user) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    // Query to get notifications for the logged-in user
    pool.query('SELECT * FROM notification WHERE user_id = ? ORDER BY creation_date DESC', [user.cms_id], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Logging the error for debugging
            return res.status(500).json({ error: 'Database error' }); // Send a 500 Internal Server Error response
        }
        
        return res.status(200).json(result); // Send the notifications as a JSON response
    });
});

routerNot.put('/:notificationId', (req, res, next) => {
    const user = req.session.user; // Getting the user from the session
    if (!user) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    const notificationId = req.params.notificationId; // Getting the notification ID from the request parameters

    // Query to mark the notification as read
    pool.query('UPDATE notification SET is_read = 1 WHERE notification_id = ?', [notificationId], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Logging the error for debugging
            return res.status(500).json({ error: 'Database error' }); // Send a 500 Internal Server Error response
        }
        
        return res.status(200).json({ message: 'Notification marked as read' }); // Send a success message as a JSON response
    });
});

routerNot.post('/mark-all-read', (req, res, next) => {
    const user = req.session.user; // Getting the user from the session
    if (!user) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    // Query to mark all notifications as read for the logged-in user
    pool.query('UPDATE notification SET is_read = 1 WHERE user_id = ?', [user.cms_id], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Logging the error for debugging
            return res.status(500).json({ error: 'Database error' }); // Send a 500 Internal Server Error response
        }
        
        return res.status(200).json({ message: 'All notifications marked as read' }); // Send a success message as a JSON response
    });
});

routerNot.get('/count', (req, res, next) => {
    const user = req.session.user; // Getting the user from the session
    if (!user) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    // Query to count unread notifications for the logged-in user
    pool.query('SELECT COUNT(*) AS unread_count FROM notification WHERE user_id = ? AND is_read = 0', [user.cms_id], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Logging the error for debugging
            return res.status(500).json({ error: 'Database error' }); // Send a 500 Internal Server Error response
        }
        
        return res.status(200).json({ count: result[0].unread_count }); // Send the count of unread notifications as a JSON response
    });
});

exports.routerNot = routerNot; // Exporting the router