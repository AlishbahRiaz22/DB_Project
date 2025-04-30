const routerFeedback = require('express').Router();
const { pool } = require('../db_connection');

routerFeedback.post('/', (req, res) => {
    const item_id = req.body.item_id;
    const rating = req.body.rating;
    const review = req.body.review;
    const owner_id = req.body.owner_id;

    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has already left feedback for this item
    pool.query(
        'SELECT * FROM item_feedback WHERE item_id = ? AND reviewer_id = ?;', 
        [item_id, user.cms_id], 
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.length > 0) {
                // Update the review
                pool.query(
                    'UPDATE item_feedback SET rating = ?, review = ?, creation_date = NOW() WHERE item_id = ? AND reviewer_id = ?;',
                    [rating, review, item_id, user.cms_id],
                    (err, result) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json({ error: 'Failed to update feedback' });
                        }
                        
                        return res.status(200).json({ message: 'Feedback updated successfully' });
                    }
                );
                return;
            }
            
            // Create a new feedback entry in the database
            pool.query(
                'INSERT INTO item_feedback (item_id, reviewer_id, rating, review, creation_date) VALUES (?, ?, ?, ?, NOW());',
                [item_id, user.cms_id, rating, review],
                (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ error: 'Failed to submit feedback' });
                    }
                    
                    return res.status(200).json({ message: 'Feedback submitted successfully' });
                }
            );
        }
    );
});

exports.routerFeedback = routerFeedback;