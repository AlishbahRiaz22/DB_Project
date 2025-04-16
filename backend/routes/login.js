const { pool } = require('../db_connection'); // Importing the connection pool
const routerLoginIn = require('express').Router(); // Importing an express router
const { check, validationResult } = require('express-validator'); // For input validation
const bcrypt = require('bcrypt'); // For comparing the password with the stored hashed password

// Defining a post route for login request
routerLoginIn.post('/', [check('email').isEmail().normalizeEmail(), 
    check('password').isLength({ min: 6 }).trim()], 
    (req, res, next) => {
    let { email, password } = req.body; // Storing the email and password in the req body
    // If the email contains a blank we break it off at the blank and store the substring upto the blank
    if (email.includes(" ")) {
        email = email.substring(0, email.indexOf(" "));
    }

    // Checking if the posted data passes the check criteria
    const errors = validationResult(req);
    // If there are errors reported by the validation middleware, we return status 400
    if (!errors.isEmpty()) { 
        return res.status(400).json({ errors: errors.array() });
      }
    
    // Query string
    const que = `SELECT * FROM users WHERE email = \"${email}\"`;
    // Executing the query
    pool.query(que, async (err1, result) => {
        // If there is an error in the query execution
        if (err1) {
            console.log("Error while Querying", err1);
            res.status(500).send("Internal Server Error");
            return;
        }
        // If the query returns no rows
        if (result.length == 0) {
            res.status(404).send("No user found");
            return;
        }
        // If the query returns a row, we validate it against the password in the req
        if (await bcrypt.compare(password, result[0].password)) {
            // Setting the session information
            req.session.user = {cms_id: result[0].cms_id, full_name: result[0].full_name, username: result[0].username, phone: result[0].phone}; // Storing the email in the session
            req.session.save(err => { // Explicitly save the session
                if (err) {
                    console.error("Session save error:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                res.status(200).send("Login successful");
            });
            return;
        } else { // If the password doesnt match
            res.status(404).send("Wrong Password");
            return;
        }   
    })
})

routerLoginIn.get('/', (req, res) => {
    console.log(req.session.user);
    res.status(200).send(req.session); // Send a response indicating the session is active
});

exports.routerLoginIn = routerLoginIn;