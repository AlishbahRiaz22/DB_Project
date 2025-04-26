const { pool } = require('../db_connection'); // Importing the connection pool
const routerSignUp = require('express').Router(); // Importing an express router
const { check, validationResult } = require('express-validator'); // For input validation
const bcrypt = require('bcrypt'); // For comparing the password with the stored hashed password

// Hashing function
async function hashPassword(password) {
  const saltRounds = 10; // Adjust based on your security needs
  // Generating a salt with 10 rounds
  const salt = await bcrypt.genSalt(saltRounds);
  // Hashing the passed password with the salt
  const hash = await bcrypt.hash(password, salt);
  
  // Returning the hashed password
  return hash;
}

// Defining the post route for the sign up requests
routerSignUp.post("/", [check('email').isEmail().normalizeEmail(),
    check('name').isString().isLength({ min: 3 }).trim().escape(),
    check('cms_id').isNumeric().isLength({ min: 6, max: 6 }).trim(),
    check('password').isLength({ min: 6 }).trim(),
    check('username').isString().isLength({ min: 3 })]
    , async (req, res, next) => {
    // Storing the information from the req body
    let { email, password, cms_id, phone, username, name } = req.body;
    
    // Checking for errors during the middleware validation
    const errors = validationResult(req);
    
    // If there are errors, we return status 400
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Hashing the password
    const hashedPass = await hashPassword(password);
    
    // Query String
    const que = `INSERT INTO users VALUES (${cms_id}, \'${name}\', \'${username}\', \'${hashedPass}\', \'${email}\', \'${phone}\', 0);`;
    // Executing the query
    pool.query(que, (err) => {
        if (err) { // If mysql server returns an error 
            console.log("Error while Querying", err);
            res.status(400).send("Sign up failed");
            return;
        } else { // IF the user is created successfully
            res.status(200).send("User created successfully");
        }
    });
})

exports.routerSignUp = routerSignUp;

