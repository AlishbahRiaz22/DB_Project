const express = require('express');
const bodyParser = require('body-parser');
const { routerLoginIn } = require('./routes/login');
const { routerSignUp } = require('./routes/signup');
require('dotenv').config();
const session = require('express-session');
const { routerLoginOut } = require('./routes/logout');
const cors = require('cors'); // Importing the cors package

const app = express(); // Initializing the express app
const port = process.env.SPORT; // Loading the server port specified in env file

app.use(session({ // Config cookie session middleware
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        // Enable only for HTTPS
        httpOnly: true,
        // Prevent client-side access to cookies
        sameSite: 'lax',
        // Mitigate CSRF attacks
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allowing requests from this origin
    credentials: true // Allowing credentials to be sent with requests
})); // Configuring CORS to allow cross-origin requests
app.use(bodyParser.json()); // Config Bodyparser middleware
app.use('/login', routerLoginIn); // Config different routes
app.use('/signup', routerSignUp); 
app.use('/logout', routerLoginOut);
app.use('/browse', require('./routes/browse').routerBrowse); // Config browse route

// Starting the server
app.listen(port, () => {
    console.log("Server running on port " + port);
})