'use strict';

var validator = require('validator'),
path = require('path'),
config = require(path.resolve('./config/config'));

var request = require('request');


/**
 * Render the main application page
 */
 exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
     _id: req.user._id,
     displayName: validator.escape(req.user.displayName),
     provider: validator.escape(req.user.provider),
     /*username: validator.escape(req.user.username),*/
     created: req.user.created.toString(),
     roles: req.user.roles,
     profileImageURL: req.user.profileImageURL,
     phoneNumber: req.user.phoneNumber,
     email: validator.escape(req.user.email),
     lastName: validator.escape(req.user.lastName),
     firstName: validator.escape(req.user.firstName),
     additionalProvidersData: req.user.additionalProvidersData
   };
 }

 res.render('modules/core/server/views/index', {
  user: JSON.stringify(safeUserObject),
  sharedConfig: JSON.stringify(config.shared)
});
};

/**
 * Render the server error page
 */
 exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
 exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};


exports.testApiCall = function (req, res) {


  var url = 'https://sandbox.itunes.apple.com/verifyReceipt';

  var formData =  {
    'password' : 'c686a3e19a1f484d85e2dc261b79fcfe',
    'receipt-data' : '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'
  }

  request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      console.log("errrrrrr",err) // Show the HTML for the Google homepage. 

    }

    console.log("bodyyyyyy",body);

    console.log("httpResponse",JSON.stringify(httpResponse));


  })

};