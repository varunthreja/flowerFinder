'use strict';

/**
 * Module dependencies
 */
 var adminPolicy = require('../policies/admin.server.policy'),
 admin = require('../controllers/admin.server.controller');

 module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
  .post(adminPolicy.isAllowed, admin.create)
  .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
  .get(/*adminPolicy.isAllowed,*/ admin.read)
  .put(adminPolicy.isAllowed, admin.update)
  .delete(adminPolicy.isAllowed, admin.delete);


  app.route('/api/changeUserStatus/:userId')
  .post(admin.changeUserStatus)

  app.route('/api/changeUserDeleteStatus/:userId')
  .post(admin.changeUserDeleteStatus)

  app.route('/api/plants/favourite').post(admin.addRemoveToFavoritePlant);
  app.route('/api/favourite/plants').post(admin.favoritePlantList);

  app.route('/api/counts/users').get(admin.getAllTypesUserCounts);
  
   // Finish by binding the user middleware
   app.param('userId', admin.userByID);
 };
