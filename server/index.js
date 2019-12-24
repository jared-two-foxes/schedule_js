// index.js

/**
 * Required External Modules
 */
const express = require('express');
const cors = require('cors');

const expressSession = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();


/**
 * App Variables
 */
const app = express();
//const port = process.env.PORT || 3001;
const port = 3001;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

require('./passport_setup')


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

app.use(cors());

app.use(expressSession(session));

app.use(passport.initialize());
app.use(passport.session());


// const authCheck = (req, res, next) => {
//     if (!req.user) {
//         res.status(401).json({
//             authenticated: false, 
//             message: "user has not been authenticated"
//         });   
//     } else { 
//         next();
//     }
// };

// Auth Routes
const authRoutes = require("./auth");
app.use("/auth", authRoutes);

// Auth Routes
const currentRouter = require("./tasks");
app.use("/", currentRouter);

// And go!
app.listen(port, function () {
    console.log('App listening on port: ' + port);
});