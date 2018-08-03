// server.js
//module dependencies
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var session = require('express-session');
var passport = require('passport');
//var flash    = require('connect-flash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var fs = require('fs');

if (!module.parent) app.use(logger('dev'));
	//app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms

	//app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	// session support
	app.use(session({ secret: 'some secret here' }));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
		
	// HOME PAGE (with login links) 

	app.get('/', function(req, res) {
		//res.render('index.ejs'); // load the index.ejs file
	fs.readFile(__dirname + '/views/index.html', function(err, data)
  	{
    if(err)
    {
      throw err;
      console.log(err);
    }

    res.send(data.toString());

 	 });
	});

	
 app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


 // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


app.get('/profile', isLoggedIn, function(req, res) {
		/*res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});*/
res.write("<html><body><table id = 'user data'><tr><td><b>id:</b> "+req.user.id+"</td></tr><tr><td><b>Name:</b> "+req.user.name+"</td></tr><tr><td><b>email:</b> "+req.user.email+"</td></tr><tr><td><b>token:</b> "+req.user.token+"</td></tr></table><br><a href=/logout>Logout</a>");
res.end("</body></html>");
	});

app.get('/logout', function(req, res) {
	 	req.logout();
	 	res.redirect('/');
	 });

 // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        
            done(null, user);
    
    });

    // FACEBOOK ================================================================
   

    passport.use(new GoogleStrategy({

        clientID        : "65883799514-tfj1nslq4231ve9ahvtvlrpb6o8t8ci9.apps.googleusercontent.com",
        clientSecret    : "455Yx3CTFGSFbC0JL78SSdSr",
        callbackURL     :  'http://localhost:8899/auth/google/callback'
        
  },

   function(token, refreshToken, profile, done) 
   {

   		console.log('accessToken---->'+token);
   		console.log('Profile===========>'+JSON.stringify(profile));

       process.nextTick(function () {

        	var user = {
	
        	id: profile.id,
        	//link: profile.profileUrl,
        	token: token,
        	email: profile.emails[0].value,
       		name:	profile.displayName
        };

       	
        return done(null, user);
        
       
   	 
        });
    }

));

    // route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
};
// launch ======================================================================
app.listen(8899);
console.log('The magic happens on port ' + 8899);
