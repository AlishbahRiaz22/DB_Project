const routerUser = require('express').Router(); // Importing an express router
const { pool } = require('../db_connection'); // Importing the connection pool

function indexOf (arr, item) {
    for (let i = 0; i < arr.length; i++) { // Iterating through the array
        if (arr[i].full_name === item) { // Checking if the requester ID matches
            return i; // Returning the index if found
        }
    }
    return -1; // Returning -1 if not found
}

routerUser.get('/' , (req, res, next) => {
    const userId = req.session.user.cms_id; // Retrieving the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // Sending a 401 response if user ID is not found in the session
    }
    
    // Query to fetch user data from the database
    pool.query('SELECT * FROM users WHERE cms_id = ?', [userId], (error, results) => { // Querying the database for user information
        if (error) {
            console.error('Error fetching user data:', error); // Logging any errors that occur during the query
            return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' }); // Sending a 404 response if no user is found
        }
        res.json(results[0]); // Sending the user data as a JSON response
    });
}); // Defining a GET route to fetch user data by ID 

routerUser.get('/listings', (req, res, next) => {
    const userId = req.session.user.cms_id; // Retrieving the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // Sending a 401 response if user ID is not found in the session
    }

    // Query to fetch user listings from the database
    pool.query('SELECT * FROM borrowable_items WHERE owner_id = ?', [userId], (error, results_bor) => { // Querying the database for user listings
        let results = []; // Initializing an empty array to store the results

        if (error) {
            console.error('Error fetching user listings:', error); // Logging any errors that occur during the query
            return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
        }

        pool.query('SELECT * FROM tradeable_items WHERE owner_id = ?', [userId], (error, results_trade) => { // Querying the database for user listings
            if (error) {
                console.error('Error fetching user listings:', error); // Logging any errors that occur during the query
                return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
            }
            console.log('User listings:', results_bor, results_trade); // Logging the user listings
              
            results = [...results_bor, ...results_trade]; // Merging the results from both queries
            if (results.length === 0) {
                return res.status(404).json({ error: 'No listings found' }); // Sending a 404 response if no listings are found
            }
            
            res.json(results); // Sending the user listings as a JSON response
        });
    }); 
}); // Defining a GET route to fetch user listings

// In a new file like items.js or in an existing route file
routerUser.delete('/listings/delete', (req, res) => {
    const userId = req.session.user.cms_id;
    const { itemId, itemType } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!itemId || !itemType) {
      return res.status(400).json({ error: 'Missing item ID or type' });
    }
    
    // Determine which table to delete from
    const tableName = itemType === 'tradeable' ? 'tradeable_items' : 'borrowable_items';
    
    // Use a transaction to ensure data consistency
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection error:', err);
        return res.status(500).json({ error: 'Database connection failed' });
      }
      
      // First check if the user owns the item
      connection.query(
        `SELECT * FROM ${tableName} WHERE item_id = ? AND owner_id = ?`,
        [itemId, userId],
        (err, results) => {
          if (err) {
            connection.release();
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (results.length === 0) {
            connection.release();
            return res.status(403).json({ error: 'You do not have permission to delete this item' });
          }
          
          // Delete the item
          connection.query(
            `DELETE FROM ${tableName} WHERE item_id = ?`,
            [itemId],
            (err, result) => {
              connection.release();
              
              if (err) {
                console.error('Delete error:', err);
                return res.status(500).json({ error: 'Failed to delete item' });
              }
              
              res.json({ message: 'Item deleted successfully' });
            }
          );
        }
      );
    });
  });

routerUser.get('/incoming-requests/borrow', (req, res) => {
    const userId = req.session.user.cms_id; // Retrieving the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // Sending a 401 response if user ID is not found in the session
    }

    pool.query('SELECT b.item_id, br.requester_id, reason, item_name, b.image_url, u.full_name, br.borrow_dur, br.creation_date, br.borrow_id AS request_id FROM borrow_req br JOIN borrowable_items b ON b.item_id = br.item_id JOIN users u ON br.requester_id = u.cms_id WHERE b.owner_id = ?', [userId], (error, results) => { // Querying the database for incoming requests
        if (error) {
            console.error('Error fetching incoming requests:', error); // Logging any errors that occur during the query
            return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'No incoming requests found' }); // Sending a 404 response if no incoming requests are found
        }

        //console.log('Incoming requests:', users); // Logging the incoming requests
        res.status(200).json(results); // Sending the incoming requests as a JSON response


    })
    
}); // Defining a GET route to fetch incoming requests


routerUser.get('/outgoing-requests', (req, res) => {
    const userId = req.session.user.cms_id; // Retrieving the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // Sending a 401 response if user ID is not found in the session
    }

    // Query to fetch outgoing requests from the database
    pool.query('SELECT br.item_id, br.borrow_id AS id, br.creation_date, reason, borrow_dur, username, item_name, image_url FROM borrow_req br JOIN users u ON u.cms_id = br.owner_id JOIN borrowable_items bi ON bi.item_id = br.item_id WHERE requester_id = ?', [userId], (error, results) => { // Querying the database for outgoing requests
        if (error) {
            console.error('Error fetching outgoing requests:', error); // Logging any errors that occur during the query
            return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
        }

        // console.log('Outgoing requests:', results); // Logging the outgoing requests
        
        pool.query('SELECT tr.requested_id AS item_id, tr.trade_id AS id, tr.creation_date, reason, token_val, username, item_name, image_url FROM trades tr JOIN users u ON u.cms_id = tr.owner_id JOIN tradeable_items ti ON ti.item_id = tr.requested_id WHERE requester_id = ?', [userId], (error, results_trade) => { // Querying the database for outgoing requests
            if (error) {
                console.log("HELLO");
                console.error('Error fetching outgoing requests:', error); // Logging any errors that occur during the query
                return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
            }
            
            // console.log('Outgoing requests:', results, results_trade); // Logging the outgoing requests
              
            const allResults = [...results, ...results_trade]; // Merging the results from both queries
            if (allResults.length === 0) {
                return res.status(404).json({ error: 'No outgoing requests found' }); // Sending a 404 response if no outgoing requests are found
            }
            
            res.status(200).json(allResults); // Sending the outgoing requests as a JSON response
        });

    });
}); // Defining a GET route to fetch outgoing requests

routerUser.delete('/outgoing-requests/:type/cancel/:request_id', (req, res) => {
    const userId = req.session.user.cms_id; // Retrieving the user ID from the session
    const requestId = req.params.request_id; // Extracting the request ID from the request parameters
    const type = req.params.type; // Extracting the type from the request parameters

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // Sending a 401 response if user ID is not found in the session
    }

    if (!requestId) {
        return res.status(400).json({ error: 'Missing request ID' }); // Sending a 400 response if request ID is missing
    }

    // Determine which table to delete from based on the type
    const tableName = type === 'trade' ? 'trades' : 'borrow_req'; // Setting the table name based on the type

    
    pool.query(`DELETE FROM ${tableName} WHERE ${type === 'trade' ? 'trade_id' : 'borrow_id'} = ? AND requester_id = ?`, [requestId, userId], (error, results) => { // Querying the database to delete the request
        if (error) {
            console.error('Error deleting request:', error); // Logging any errors that occur during the query
            return res.status(500).json({ error: 'Internal server error' }); // Sending a 500 response if an error occurs
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found or you do not have permission to delete it' }); // Sending a 404 response if the request is not found or permission is denied
        }

        res.status(200).json({ message: 'Request cancelled successfully' }); // Sending a success message as a JSON response
    });
}); // Defining a DELETE route to cancel outgoing requests

exports.routerUser = routerUser; // Exporting the router for use in other files