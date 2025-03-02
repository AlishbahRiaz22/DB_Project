const express = require('express');
const bodyParser = require('body-parser');
const { routerLoginIn } = require('./routes/login');
const { routerSignUp } = require('./routes/signup');
require('dotenv').config();
const session = require('express-session');
const { routerLoginOut } = require('./routes/logout');

const app = express(); // Initializing the express app
const port = process.env.SPORT; // Loading the server port specified in env file

app.use(bodyParser.json()); // Config Bodyparser middleware
app.use(session({ // Config cookie session middleware
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        // Enable only for HTTPS
        httpOnly: true,
        // Prevent client-side access to cookies
        sameSite: 'strict'
        // Mitigate CSRF attacks
    }
}));
app.use('/login', routerLoginIn); // Config different routes
app.use('/signup', routerSignUp); 
app.use('/logout', routerLoginOut);

// Starting the server
app.listen(port, () => {
    console.log("Server running");
})