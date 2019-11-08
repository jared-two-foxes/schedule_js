// auth.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");


/**
 * Routes Definitions
 */

 // Redirect the user to the OAuth 2.0 provider for authentication.  When
// compelte, the provider will redirect the user back to the application
// at /auth/provider/callback.
router.get( 
    "/auth/current",
    passport.authenticate("current-rms"),
    (req, res) => {
        console.log( "this is the callback in the router login function");
    }
);

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
    "/auth/current/callback",
    passport.authenticate("current-rms"),
    (req, res) => {
        console.log( "this is the callback in the router login callback function");
        console.log( req.user );
        res.cookie('accessToken', req.user.accessToken );
        res.cookie('refreshToken', req.user.refreshToken );
        res.redirect('/');
    }
);


/**
 * Module Exports
 */

module.exports = router;