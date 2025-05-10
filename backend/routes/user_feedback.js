const routerUserFeedback = require('express').Router();
const { pool } = require('../db_connection');

routerUserFeedback.get('/user/:cms_id', (req, res) => {
    const cms_id = req.params.cms_id;
    const query = 'SELECT * FROM users WHERE cms_id = ?';

    // console.log('Fetching user feedback for CMS ID:', cms_id);
    
    pool.query(query, [cms_id], (err, results) => {
        if (err) {
            console.error('Error fetching user feedback:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

routerUserFeedback.get('/feedback/:cms_id', (req, res) => {
    const cms_id = req.params.cms_id;
    const query = 'SELECT ur.rating, ur.reviewer_id, ur.user_id, ur.review, u.username FROM user_review ur JOIN users u ON ur.reviewer_id = u.cms_id WHERE user_id = ?';

    // console.log('Fetching feedback for CMS ID:', cms_id);
    
    pool.query(query, [cms_id], (err, results) => {
        if (err) {
            console.error('Error fetching feedback:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

routerUserFeedback.post('/feedback', (req, res) => {
    const { user_id, rating, review } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const reviewer_id = user.cms_id; // Assuming the reviewer_id is the logged-in user's cms_id
    const query = 'INSERT INTO user_review (user_id, reviewer_id, rating, review) VALUES (?, ?, ?, ?)';

    // console.log('Inserting feedback:', req.body);
    
    pool.query(query, [user_id, reviewer_id, rating, review], (err, results) => {
        if (err) {
            console.error('Error inserting feedback:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Feedback submitted successfully' });
    });
});

exports.routerUserFeedback = routerUserFeedback;