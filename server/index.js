// index.js

/**
 * Required External Modules
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const expressSession = require('express-session');
const passport = require('passport')
const passportSetup = require('./passport_setup')


/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || 3000;

const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');



/**
 * Session Configuration
 */

const session = {
    secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
    cookie: {}, // default { path: '/', httpOnly: true, secure: false, maxAge: null }
    resave: false,
    saveUninitialized: false
};

 
/** 
 * App Configuration
 */

// const corsOptions = {
//     methods: ['GET', "HEAD", "OPTIONS", "POST", "PUT" ],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(cors());

app.use(express.static(DIST_DIR));
app.use(expressSession(session));

app.use(passport.initialize());
app.use(passport.session());



// Auth Routes
const authRoutes = require("./auth");
app.use("/auth", authRoutes);

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false, 
            message: "user has not been authenticated"
        });   
    } else { 
        next();
    }
};

// Auth Routes
const currentRouter = require("./tasks");
app.use("/", currentRouter);

// Main page.
app.get( '/', (req, res) => {
    res.sendFile( HTML_FILE );
});

// And go!
app.listen(port, function () {
    console.log('App listening on port: ' + port);
});