const routerLoginOut = require('express').Router(); // Importing an express router

routerLoginOut.post('/', (req, res, next) => {
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.status(200).send('Logged out');
        }
    });
})

exports.routerLoginOut = routerLoginOut;