const flash = require("connect-flash");
var db = require('../lib/db')
const bcrypt = require('bcrypt');

module.exports = function(app) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local');
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
    return passport
}