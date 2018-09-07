'use strict';

/**
 * Module dependencies
 */
 var passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
 User = require('mongoose').model('User');

 module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (usernameOrEmail, password, done) {

    usernameOrEmail=usernameOrEmail.trim().replace(/ /g, '+');

    User.findOne({

      email: usernameOrEmail.toLowerCase()
    }
    , function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid email or password'
        }); //(' + (new Date()).toLocaleTimeString() + ')'
      }

      if (user.isDeleted) {
        return done(null, false, {
          message: 'User is deleted'
        }); 
      }

      if (!user.isActive) {
        return done(null, false, {
          message: 'User is In-active'
        }); 
      }

      return done(null, user);
    });
  }));
};
