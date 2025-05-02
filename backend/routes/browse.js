const routerBrowse = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerBrowse.post('/', (req, res, next) => {
    // Extracting the params from the req body
    const item_type = req.body.param1;
    const item_id = req.body.param2;

    // If the params in the body are invalid
    if ((item_type !== 'borrowable' || item_type !== 'tradable') && item_id.length === 0) {
        res.status(404).send("Wrong parameters");
    }
    else {
        // If the item to be displayed is of borrowable type
        if (item_type === 'borrowable') {
            // The query to fetch borrowable items from the database along with their categories and owners where b.item_id equals item_id param
            const que_borrow = `SELECT c.category_name, c.description, b.item_id, b.item_name, u.username, u.cms_id, image_url, status, item_description 
            FROM borrowable_items b
            JOIN users u ON b.owner_id = u.cms_id
            LEFT JOIN borrow_category Boc ON b.item_id = Boc.item_id
            LEFT JOIN category c ON c.category_id = Boc.category_id WHERE b.item_id = ${item_id};`;

            // Query to retrieve the item from the database
            pool.query(que_borrow, (err, result_borrow) => {
                if (err) { // If there is an error executing the query, log it and send a 500 response
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Database query error' });
                }
                const relatedItems = result_borrow[0].category_name;

                // The query to fetch the items that have the same category
                const que_borrow_cat = `SELECT c.category_name, c.description, b.item_id, b.item_name, u.username, u.cms_id, image_url, status, item_description 
                FROM borrowable_items b
                JOIN users u ON b.owner_id = u.cms_id
                LEFT JOIN borrow_category Boc ON b.item_id = Boc.item_id
                LEFT JOIN category c ON c.category_id = Boc.category_id WHERE c.category_name = '${relatedItems}' and b.item_id != ${item_id};`;

                // Inner Query to retrieve the items that have the same category
                pool.query(que_borrow_cat, (err, result_borrow_cat) => {
                    if (err) { // If there is an error executing the query, log it and send a 500 response
                        console.error('Error executing query:', err);
                        return res.status(500).json({ error: 'Database query error' });
                    }

                    // Creating the combinedResult object
                    const combinedResults = {
                        relatedItems: result_borrow_cat,
                        type: 'borrow',
                        itemDetails: result_borrow,
                    }

                    // Sending the response to the frontend
                    res.status(200).send(combinedResults);
                })
            })
        }
        else if (item_type === 'tradable') {
            // The query to fetch tradable items from the database along with their categories and owners where t.item_id = item_id
            const que_trade = `SELECT c.category_name, c.description, u.username, t.item_name, t.item_id, u.cms_id, image_url, status,   item_description
                FROM     tradeable_items t
                JOIN users u ON t.owner_id = u.cms_id
                LEFT JOIN trade_category Toc ON t.item_id = Toc.item_id
                LEFT JOIN category c ON c.category_id = Toc.category_id WHERE t.item_id = ${item_id};`;

            // Query to retrieve the item from the database
            pool.query(que_trade, (err, result_trade) => {
                if (err) { // If there is an error executing the query, log it and send a 500 response
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Database query error' });
                }
                const relatedItems = result_trade[0].category_name;

                // The query to fetch the items that have the same category
                const que_trade_cat = `SELECT c.category_name, c.description, u.username, t.item_name, t.item_id, u.cms_id, image_url, status, item_description
                    FROM tradeable_items t
                    JOIN users u ON t.owner_id = u.cms_id
                    LEFT JOIN trade_category Toc ON t.item_id = Toc.item_id
                    LEFT JOIN category c ON c.category_id = Toc.category_id WHERE c.category_name = '${relatedItems}' and t.item_id != ${item_id};`;

                // Query to retrieve the items that have the same category
                pool.query(que_trade_cat, (err, result_trade_cat) => {
                    if (err) { // If there is an error executing the query, log it and send a 500 response
                        console.error('Error executing query:', err);
                        return res.status(500).json({ error: 'Database query error' });
                    }

                    // Combining the result into the combinedResults obj
                    const combinedResults = {
                        relatedItems: result_trade_cat,
                        type: 'trade',
                        itemDetails: result_trade,
                    }

                    // Sending the response to the frontend
                    res.status(200).send(combinedResults);
                })
            })
        }
    }
});

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
    const que_trade = `SELECT c.category_name, c.description, u.username, t.item_name, t.item_id, u.cms_id, image_url, status, item_description
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

routerBrowse.get('/featured', (req, res, next) => {
    const featuredItemsQuery = `SELECT c.category_name, c.description, b.item_id, b.item_name, u.username, u.cms_id, image_url, status, item_description
    FROM borrowable_items b
    JOIN users u ON b.owner_id = u.cms_id
    LEFT JOIN borrow_category Boc ON b.item_id = Boc.item_id
    LEFT JOIN category c ON c.category_id = Boc.category_id
    WHERE b.status = 1
    ORDER BY RAND()
    LIMIT 3;`;
    
    pool.query(featuredItemsQuery, (err, result) => {
        if (err) { // If there is an error executing the query, log it and send a 500 response
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        // Sending the featured items as JSON response
        res.json(result); 
    });
});

exports.routerBrowse = routerBrowse; // Exporting the router