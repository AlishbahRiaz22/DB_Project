const routerTrade = require('express').Router();
const { pool } = require('../db_connection'); // Importing the connection pool

routerTrade.post('/', (req, res) => {
    const desired_item_id = req.body.desired_item_id;
    const offered_item_id = req.body.offered_item_id;
    const reason = req.body.reason;
    const owner_id = req.body.owner_id;
    const token_val = req.body.token_val; // Token value for the item being offered

    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.cms_id === owner_id) {
        return res.status(400).json({ error: 'You cannot trade with yourself' });
    }

    if (user.tokens < token_val) {
        return res.status(400).json({ error: 'You do not have enough tokens to trade' });
    }

    // Check if the desired item is available and not owned by the requester
    pool.query('SELECT * FROM tradeable_items WHERE item_id = ? AND status = 1', [desired_item_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not available for trading' });
        }

        // Check if user already has a trade request for this item
        pool.query(
            'SELECT * FROM trades WHERE requested_id = ? AND requester_id = ?', 
            [desired_item_id, user.cms_id], 
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (result.length > 0) {
                    return res.status(400).json({ error: 'You have already requested to trade for this item' });
                }
                
                // Create a trade request in the database
                pool.query(
                    'INSERT INTO trades (requested_id, offered_item, requester_id, reason, owner_id, creation_date) VALUES (?, ?, ?, ?, ?, NOW())',
                    [desired_item_id, offered_item_id, user.cms_id, reason, owner_id],
                    (err, result) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json({ error: 'Failed to create trade request' });
                        }
                        
                        return res.status(200).json({ message: 'Trade request created successfully' });
                    }
                );
            }
        );
    });
});

routerTrade.get('/userItems', (req, res) => {
    const user = req.session.user;
    
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    pool.query('SELECT t.item_id, t.owner_id, t.status, t.token_val, t.image_url, c.category_name FROM tradeable_items t LEFT JOIN trade_category tc ON t.item_id = tc.item_id LEFT JOIN category c ON c.category_id = tc.category_id WHERE owner_id = ? and status = 1;', [user.cms_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log("User items:", results);
        return res.status(200).json(results);
    })
})

exports.routerTrade = routerTrade;