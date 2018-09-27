'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 mongoose = require('mongoose'),
 passport = require('passport'),
 User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
'/authentication/signin',
'/authentication/signup'
];

/**
 * Signup
 */
 exports.signup = function (req, res) {
  console.log(req.body)
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  if(req.body.deviceToken && req.body.deviceType){
    req.body.loginDevices=[{
      deviceToken: req.body.deviceToken,
      deviceType : req.body.deviceType

    }];
  }
  
  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = (req.body.provider)?req.body.provider:'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.email=user.email.replace(/ /g, '+');

  //check if user already signup with email address
  User.findOne({email:user.email},function(error,emailUser){
    if(error){
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    }else if(emailUser && user.provider!=='local'){

    // Remove sensitive data before login
    emailUser.password = undefined;
    emailUser.salt = undefined;

    req.login(emailUser, function (err) {
      if (err) {
        res.status(400).send(err);
      } else {

        //add divice token to db
        if(req.body.deviceType && req.body.deviceToken){
          User.update(
            { _id: emailUser._id },            
            {  $addToSet:{ 
              loginDevices: {
                'deviceType': req.body.deviceType,
                'deviceToken': req.body.deviceToken
              }
            }}
            ).exec(function(deviceerr, loggeduser) {
              if(deviceerr)
               res.status(400).send({message:errorHandler.getErrorMessage(deviceerr)});

           });
          }

          if(req.body.timeZoneAndUtcOffset){
            User.update(
              { _id: emailUser._id },
              { $set: {
                timeZoneAndUtcOffset:req.body.timeZoneAndUtcOffset

              } 
            }
            ).exec(function(err, loggeduser) {
              if(err)
                console.log(err);

            });
          }

          var response={user:emailUser,
            status:'success'}

            
            return res.json(response);
          }
        });

  }else{

      // Then save the user
      user.save(function (err) {
        if (err) {

          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // Remove sensitive data before login
          user.password = undefined;
          user.salt = undefined;

          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {

             var response={user:user,
              status:'success'}
              return res.json(response);
            }
          });
        }
      });


    }


  })

  
};

/**
 * Signin after passport authentication
 */
 exports.signin = function (req, res, next) {

  console.log(req.body)

  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send({err:err,info:info,message:info.message});
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {


          //add divice token to db
          if(req.body.deviceType && req.body.deviceToken){

            User.update(
              { _id: user._id },            
              {  $addToSet:{ 
                loginDevices: {
                  'deviceType': req.body.deviceType,
                  'deviceToken': req.body.deviceToken
                }
              }}
              ).exec(function(deviceerr, loggeduser) {
                if(deviceerr)
                 res.status(400).send({message:errorHandler.getErrorMessage(deviceerr)});

             });
            }

            if(req.body.timeZoneAndUtcOffset){
              User.update(
                { _id: user._id },
                { $set: {
                  timeZoneAndUtcOffset:req.body.timeZoneAndUtcOffset

                } 
              }
              ).exec(function(err, loggeduser) {
                if(err)
                  console.log(err);

              });
            }

            var response={user:user,status:'success'}
            res.json(response);
          }
        });
    }
  })(req, res, next);
};


/**
 * Signin after passport authentication
 */
 exports.updateDeviceToken = function (req, res) {

  if(!req.user){
   return  res.json({
    status:400,message: 'User is not logged-in.'

  });

 }

   //add/remove device token to db
   var isRemoveToken=req.body.isRemoveToken;
   var deviceType=req.body.deviceType;
   var deviceToken=req.body.deviceToken;

   if(!deviceType || !deviceToken){

    return  res.json({
      status:400,message: 'Device token required.'

    });

  }

  if(isRemoveToken && isRemoveToken=='true'){


    User.update(
    {         
      'loginDevices.deviceToken': deviceToken,
      'loginDevices.deviceType':deviceType
    },
    {'$pull': {
      'loginDevices':{ 'deviceToken': deviceToken, 'deviceType':deviceType }}
    },
    /*{ '$set': {'loginDevices.$.deviceToken':'' , 'loginDevices.$.deviceType':'' } },*/
    function(error, success){
      if(error){

        return  res.json({
          status:400,message: error

        });
      }


      res.json({status:'success',message:'Device token updated successfully.'})
    }); 



  }else{



    User.update(
      { _id: req.user._id },            
      {  $addToSet:{ 
        loginDevices: {
          'deviceType': req.body.deviceType,
          'deviceToken': req.body.deviceToken
        }
      }}
      ).exec(function(deviceerr, loggeduser) {
        if(deviceerr){
         res.status(400).send({message:errorHandler.getErrorMessage(deviceerr)});
       }


       res.json({status:'success',message:'Device token updated successfully.'})

     });
      

    }



  }


/**
 * Signout
 */
 exports.signout = function (req, res) {

  if(req.user){
    req.logout();
  }
  res.redirect('/');  

};


exports.appSignout = function (req, res) {

  if(req.user){
    req.logout();
  }

  var deviceType=req.body.deviceType;
  var deviceToken=req.body.deviceToken;

  //Remove logout user device token
  if(deviceType){
    User.update(
    {         
      'loginDevices.deviceToken': deviceToken,
      'loginDevices.deviceType':deviceType
    },
    {'$pull': {
      'loginDevices':{ 'deviceToken': deviceToken, 'deviceType':deviceType }}
    },
    /*{ '$set': {'loginDevices.$.deviceToken':'' , 'loginDevices.$.deviceType':'' } },*/
    function(error, success){
      if(error){

        return  res.json({
          status:400,message: error

        });
      }
    }); 

  }

  res.json({status:'success',message:'Signout successfully.'})
  
};

/**
 * Unique Check middleware
 */
 exports.checkUniqueUser = function(req, res) {
  var property=req.body.property,
  deviceType=req.body.deviceType,
  value=escape(req.body.value),
  id=req.body.id,
  status=true,
  resStatus='error',
  resCode=400,
  queryJson = {};
  queryJson[property]=new RegExp('^'+value+'$', 'i');

  if(id)
    queryJson._id={
      '$ne' : id
    };
    if(queryJson)
    {
      User.findOne(queryJson,{_id: true}, function(err,user) { 
        if(!user){
          status=false;
          resStatus='success';
          resCode=200;
        }
        if((deviceType==='iphone') || (deviceType==='android')){
          res.status(resCode).json({status:resStatus,data:{}});
          return;
        }
        res.send(status);
      });
    }
  };

/**
 * OAuth provider call
 */
 exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
 exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
 exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info object
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    info.redirect_to = req.session.redirect_to;

  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // Email intentionally added later to allow defaults (sparse settings) to be applid.
            // Handles case where no email is supplied.
            // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
            user.email = providerUserProfile.email;

            // And save the user
            user.save(function (err) {
              return done(err, user, info);
            });
          });
        } else {
          return done(err, user, info);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
 exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
