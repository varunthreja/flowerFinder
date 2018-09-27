'use strict';

/**
 * Module dependencies
 */
 var passport = require('passport');

 var basicAuth = require('basic-auth');


 var auth = function (req, res, next) {
  
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).json({status:'unauthorized',data:{message:'You are not Authorized to use this request.'}});
  }

  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'admin' && user.pass === '9EABB4E1BE58D18FF12C7D5827961') {
    return next();
  } else {
    return unauthorized(res);
  }
};

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  app.route('/api/auth/reset/:token').get(users.validateResetToken);

  app.route('/api/auth/signout')
  .get(users.signout)
  .post(users.appSignout);
  /*user section starts*/
  app.route('/api/*').all(auth);

  //check user unique user proprty
  app.route('/auth/checkUniqueUser').post(users.checkUniqueUser);

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  
  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(users.signup);
  app.route('/api/auth/signin').post(users.signin);


  //update device token
   app.route('/api/user/devicetoken').post(users.updateDeviceToken);
  

  // Setting the facebook oauth routes
  app.route('/api/auth/facebook').get(users.oauthCall('facebook', {
    scope: ['email']
  }));
  app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  app.route('/api/auth/twitter').get(users.oauthCall('twitter'));
  app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));

  // Setting the google oauth routes
  app.route('/api/auth/google').get(users.oauthCall('google', {
    scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

  // Setting the linkedin oauth routes
  app.route('/api/auth/linkedin').get(users.oauthCall('linkedin', {
    scope: [
    'r_basicprofile',
    'r_emailaddress'
    ]
  }));
  app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

  // Setting the github oauth routes
  app.route('/api/auth/github').get(users.oauthCall('github'));
  app.route('/api/auth/github/callback').get(users.oauthCallback('github'));

  // Setting the paypal oauth routes
  app.route('/api/auth/paypal').get(users.oauthCall('paypal'));
  app.route('/api/auth/paypal/callback').get(users.oauthCallback('paypal'));
};
