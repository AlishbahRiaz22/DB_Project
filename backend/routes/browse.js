const routerBrowse = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerBrowse.get('/', (req, res, next) => {
    // This route handles GET requests to the /browse endpoint
    // It retrieves borrowable and tradable items from the database and sends them as a JSON response
    // The results are combined into a single response object
    // and sent back to the client

    // The query to fetch borrowable items from the database along with their categories and owners
    const que_borrow = `SELECT c.category_name, c.description, b.item_id, b.item_name, u.username, u.cms_id, image_url, status, item_description 
    FROM borrowable_items b
    JOIN users u ON b.owner_id = u.cms_id
    LEFT JOIN borrow_category Boc ON b.item_id = Boc.item_id
    LEFT JOIN category c ON c.category_id = Boc.category_id;`;

    // The query to fetch tradable items from the database along with their categories and owners
    const que_trade = `SELECT c.category_name, c.description, u.username, t.item_name, t.item_id, u.cms_id, image_url, status, item_description, token_val
    FROM tradeable_items t
    JOIN users u ON t.owner_id = u.cms_id
    LEFT JOIN trade_category Toc ON t.item_id = Toc.item_id
    LEFT JOIN category c ON c.category_id = Toc.category_id`;

    // Execute the first query to fetch borrowable items
    pool.query(que_borrow, (err, result_borrow) => {
        if (err) { // If there is an error executing the query, log it and send a 500 response
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        // Execute the second query to fetch tradable items if the first query is successful
        pool.query(que_trade, (err, result_trade) => {
            if (err) { // If there is an error executing the second query, log it and send a 500 response
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            // Combine the results from both queries into a single response
            const combinedResults = {
                borrowable_items: result_borrow,
                tradable_items: result_trade
            };
            res.json(combinedResults); // Send the combined results as JSON
        });
    }); 
});  

exports.routerBrowse = routerBrowse; // Exporting the router