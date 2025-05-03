const routerFeedback = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerFeedback.post('/', (req, res) => {
    const itemId = req.body.item_id; // Extracting the item_id from the request body
    const que = `SELECT review, cms_id, username, rating, creation_date FROM item_feedback i JOIN users u ON u.cms_id = i.reviewer_id WHERE item_id = ${itemId}`; // Query to fetch feedback for the given item_id

    pool.query(que, (err, result) => {
        if (err) { // If there is an error executing the query, log it and send a 500 response
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        // Sending the feedback data as a response
        res.status(200).send(result);
    });
})

exports.routerFeedback = routerFeedback; // Exporting the router