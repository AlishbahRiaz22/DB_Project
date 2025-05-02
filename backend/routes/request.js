const routerRequest = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

routerRequest.post('/:action/:request_id', (req, res, next) => {
    const action = req.params.action; // Extracting the action from the request parameters  
    const request_id = req.params.request_id; // Extracting the request ID from the request parameters
    const item_name = req.body.item_name; // Extracting the item name from the request body
    const requester_id = req.body.requester_id; // Extracting the requester ID from the request body

    const user = req.session.user; // Getting the user from the session
    
    if (user === null || user === undefined) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    if (action === 'accept') { // If the action is to accept the request
        const selectedDuration = req.body.selectedDuration; // Extracting the selected duration from the request body
        // console.log("Selected duration:", selectedDuration); // Logging the selected duration

        pool.query('SELECT * FROM borrow_req WHERE borrow_id = ?', [request_id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'Request not found' });
            }

            const item_id = result[0].item_id; // Extracting the item ID from the request result

            pool.query('UPDATE borrowable_items SET status = 0 WHERE item_id = ?', [item_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Database error' });
                }

                pool.query('DELETE FROM borrow_req WHERE borrow_id = ?', [request_id], (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    pool.query(`INSERT INTO notification (user_id, notification, is_read, return_date, item_id) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ${selectedDuration} DAY), item_id)`, [requester_id, `Your borrow request for the item "${item_name}" for duration "${selectedDuration} days" has been accepted. Contact the owner at ${req.session.user.phone}`, 0], (err, result) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json({ error: 'Database error' });
                        }
                    });

                    pool.query('SELECT requester_id FROM borrow_req WHERE item_id = ?', [item_id], (err, result) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json({ error: 'Database error' });
                        }
                        pool.query('DELETE FROM borrow_req WHERE item_id = ?', [item_id], (err, result) => {
                            if (err) {
                                console.error("Database error:", err);
                                return res.status(500).json({ error: 'Database error' });
                            }
                        });

                        if (result.length > 0) {
                            const requesterIds = result.map(row => row.requester_id); // Extracting all requester IDs for the item
                            const notificationPromises = requesterIds.map(requesterId => {
                                return pool.query('INSERT INTO notification (user_id, notification, is_read) VALUES (?, ?, ?)', [requesterId, `The borrow request for the item "${item_name}" has been accepted. Cannot be borrowed for now.`, 0]);
                            });
                            return Promise.all(notificationPromises);
                        }
                    });


                    return res.status(200).json({ message: 'Request accepted successfully' });
                });
            });
        });
    }
    else if (action === 'decline') {
        // Decline the request
        pool.query('DELETE FROM borrow_req WHERE borrow_id = ?', [request_id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }


            pool.query('INSERT INTO notification (user_id, notification, is_read) VALUES (?, ?, ?)', [requester_id, `Your borrow request for the item "${item_name}" has been declined`, 0], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Database error' });
                }
            });
            
            return res.status(200).json({ message: 'Request declined successfully' });
        });
    }
});

routerRequest.post('/trade', (req, res, next) => {
    const action = req.body.action; // Extracting the action from the request body
    const requestId = req.body.requestId; // Extracting the request ID from the request body
    const item_name = req.body.itemName; // Extracting the item name from the request body
    const requester_id = req.body.requesterId; // Extracting the requester ID from the request body

    const user = req.session.user; // Getting the user from the session

    if (user === null || user === undefined) { // If the user is not logged in
        return res.status(401).json({ error: 'Unauthorized' }); // Send a 401 Unauthorized response
    }

    if (action === 'accept') { // If the action is to accept the trade request
        const offered_id = req.body.offeredId; // Extracting the offered ID from the request body
        const offered_item_name = req.body.offeredItem; // Extracting the offered item name from the request body
        const requested_id = req.body.requestedId; // Extracting the requested ID from the request body

        // Debugging
        // console.log("Action:", action);
        // console.log("Request ID:", requestId);
        // console.log("Item Name:", item_name);
        // console.log("Requester ID:", requester_id);
        // console.log("Offered ID:", offered_id);
        // console.log("Offered Item Name:", offered_item_name);
        // console.log("Requested ID:", requested_id);
        // console.log("User ID:", user.cms_id);

        pool.query("DELETE FROM trades WHERE trade_id = ?", [requestId], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }

            pool.query('SELECT requester_id FROM trades WHERE requested_id = ? OR requested_id = ?', [offered_id, requested_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Database error' });
                }
                if (result.length > 0) {
                    const requesterIds = result.map(row => row.requester_id); // Extracting all requester IDs for the item
                    const notificationPromises = requesterIds.map(requesterId => {
                        return pool.query('INSERT INTO notification (user_id, notification, is_read) VALUES (?, ?, ?)', [requesterId, `The trade request for the item "${item_name}/${offered_item_name}" has been accepted. Cannot be traded for now.`, 0]);
                    });
                    return Promise.all(notificationPromises);
                }
            });

            pool.query('DELETE FROM tradeable_items WHERE item_id = ? OR item_id = ?', [offered_id, requested_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: 'Database error' });
                }

                pool.query('INSERT INTO notification (user_id, notification, is_read) VALUES (?, ?, ?)', [requester_id, `Your trade request for the item "${item_name}" has been accepted. Contact the owner at ${req.session.user.phone}`, 0], (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                });

                return res.status(200).json({ message: 'Trade request accepted successfully' });
            });
        });
    }
    else if (action === 'decline') { // If the action is to decline the trade request
        pool.query('DELETE FROM trades WHERE trade_id = ?', [requestId], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }

            pool.query('INSERT INTO notification (user_id, notification, is_read) VALUES (?, ?, ?)', [requester_id, `Your trade request for the item "${item_name}" has been declined`, 0], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            });

            return res.status(200).json({ message: 'Trade request declined successfully' });    
        });
    }
});

exports.routerRequest = routerRequest; // Exporting the router for use in other files
