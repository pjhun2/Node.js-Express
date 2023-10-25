const flash = require("connect-flash");

module.exports = function(app) {

    var authData = {
        username: 'ian@bemyfriends.com',
        password: 'pw.1234',
        nickname: 'ian'
    }

    var passport = require('passport');
    var LocalStrategy = require('passport-local');
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(flash())

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(id, done) {
        done(null, authData);
    });


    passport.use(new LocalStrategy(function verify(username, password, done) {
        if(username === authData.username){
            if(password === authData.password) {
                return done(null, authData)
            } else {
                return done(null, false, {
                    message: 'Incorrect password.'
                })
            }
        } else {
            return done(null, false, {
                message: 'Incorrect username.'
            })
        }
    }));
    return passport
}