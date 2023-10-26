const flash = require("connect-flash");
var db = require('../lib/db')
const bcrypt = require('bcrypt');
const googleConfig = require("../config/google.json");

module.exports = function(app) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local');
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(flash())

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        var user = db.get('users').find({id:id}).value()
        done(null, user);
    });


    passport.use(new LocalStrategy(function verify(username, password, done) {
        var user = db.get('users').find({username:username}).value()
        if(user) {
            bcrypt.compare(password, user.password, function (err, result){
              if(result) {
                  return done(null, user, {
                      message: "Welcome."
                  })
              }  else {
                  return done(null, false, {
                      message: 'Incorrect Password.'
                  })
              }
            })

        } else {
            return done(null, false, {
                message: 'Incorrect User.'
            })
        }
    }));



    var googleCredentials = require('../config/google.json')

    passport.use(new GoogleStrategy({
            clientID: googleCredentials.web.client_id,
            clientSecret: googleCredentials.web.client_secret,
            callbackURL: googleCredentials.web.redirect_uris[0]
        },
        function(accessToken, refreshToken, profile, done) {
            var email = profile.emails[0].value;
            var user = db.get('users').find({username:email}).value()
            user.googleID = profile.id
            db.get('users').find({id:user.id}).assign(user).write();
            done(null, user)
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
        }
    ));

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    return passport
}