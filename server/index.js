const express = require('express');
const path = require('path');

var session = require('express-session')
var cookieParser = require('cookie-parser')

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));
//app.use(bodyParser.urlencoded({ extended: false }));

// initilaize cookie-parser to allow us to access the cookies stored in the browser
app.use(cookieParser());

// initialize express-session to allow us to track the logged-in user across sessions.
app.use(session({ 
    key: 'user_sid',
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false, 
    cookie: {
        expires: 60000
    } 
}));

// This middleware will check if user's cookie is still saved in brower and user is not set, then autmatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remain saved in broswer.
app.use((req, res, next) => {
    if ( req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

//
// Setup Passport.
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser( function(user, done) {
    console.log(`SerialiseUser: ` + JSON.stringify(user));
    done(null, user);
});

passport.deserializeUser( function(user, done){
    console.log(`deserializeUser: ${user}`);
    done(null, user);
});


//
// Setup oAuth2 Strategy
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('current-rms',
    new OAuth2Strategy(
        {
            authorizationURL:'https://twofoxesstyling.current-rms.com/oauth2/authorize',
            tokenURL: 'https://twofoxesstyling.current-rms.com/oauth2/token',
            clientID: '8fba8e6b6a9ef7eabc0a70843a3ad9ae19ed785dd01cd4960b49cfd1300c07a0',
            clientSecret: 'b6e6ab31e76e94f8f660471ea667ba3c98f50c5a94e02b8447e2907bdfda7743',
            callbackURL: 'http://localhost:3000/auth/current/callback'
        },
        function(accessToken, refreshToken, profile, done){
            // Cool we have gained credentials... 
            console.log('strategy callback function with access token etc')
            
            //req.session.user = accessToken;

            done(null, {accessToken, refreshToken, profile}); // passes the profile data to serializeUser
        }
    )
);


// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}

// Middleware function to check to logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};


//
// Current-RMS authentication Routes

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// compelte, the provider will redirect the user back to the application
// at /auth/provider/callback.
app.get( 
    "/auth/current",
    passport.authenticate("current-rms")
);

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get(
    "/auth/current/callback",
    passport.authenticate(
        "current-rms",
        { successRedirect: '/',
          failureRedirect: '/login' }
    )
);

// opportunities, indirectly route this to current-rms?.
app.get( '/opportunities', (req, res) => {
    console.log('Attempting to get current-rms opportunities');
    //req.user

    const OPPORTUNITIES_SERIVCE_URL = 'https://api.current-rms.com/api/v1/opportunities';
    
    fetch(OPPORTUNITIES_SERIVCE_URL)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(response.json())            
        });
});

// Main page.
app.get( '/', (req, res) => {
    console.log(req.user);
    res.sendFile( HTML_FILE );
});

// And go!
app.listen(port, function () {
    console.log('App listening on port: ' + port);
});