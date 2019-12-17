// auth.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

/**
 * Routes Definitions
 */

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.json({
            success: true, 
            message: 'i=user has successfully authenticated',
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false, 
        message: "user failed to authenticate."
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// compelte, the provider will redirect the user back to the application
// at /auth/provider/callback.
router.get( 
    "/current",
    passport.authenticate("current-rms")
);

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
    "/current/callback",
    passport.authenticate("current-rms", {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: "/auth/login/failure"
    })
);


/**
 * Module Exports
 */

module.exports = router;