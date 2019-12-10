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
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


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
 * Passport Configuration
 */

const strategy = new OAuth2Strategy(
    {
        authorizationURL:'https://twofoxesstyling.current-rms.com/oauth2/authorize',
        tokenURL: 'https://twofoxesstyling.current-rms.com/oauth2/token',
        clientID: '8fba8e6b6a9ef7eabc0a70843a3ad9ae19ed785dd01cd4960b49cfd1300c07a0',
        clientSecret: process.env.CURRENT_API_SECRET,
        callbackURL: 'http://localhost:3000/auth/current/callback'
    },
    function(accessToken, refreshToken, profile, done){
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        
        // Cool we have gained credentials... 
        console.log('strategy callback function with access token etc');
        console.log( "accessToken:", accessToken );
        done(null, {accessToken, refreshToken}); // passes the profile data to serializeUser
    }
);


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

passport.use('current-rms', strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( (user, done) => done(null, user) );
passport.deserializeUser( (user, done) => done(null, user) );

// Auth Routes
const authRouter = require("./auth");
app.use("/", authRouter);

// Auth Routes
const currentRouter = require("./current");
app.use("/", currentRouter);

// Main page.
app.get( '/', (req, res) => {
    console.log(req.user);
    res.sendFile( HTML_FILE );
});

// And go!
app.listen(port, function () {
    console.log('App listening on port: ' + port);
});