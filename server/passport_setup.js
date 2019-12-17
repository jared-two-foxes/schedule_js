// passport_setup.js

/**
 * Required External Modules
 */
const passport = require("passport");
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/**
 * Object Configuration
 */

passport.serializeUser( (user, done) =>  {
    done(null, user);
});

passport.deserializeUser( (user, done) => {
  done(null, user);
});

passport.use(
    'current-rms', 
    new OAuth2Strategy(
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
            
            // Cool we have gained credentials...  Lets naively
            // pass them on for now. 
            done(null, {accessToken, refreshToken, profile}); 
        }
    )
);
