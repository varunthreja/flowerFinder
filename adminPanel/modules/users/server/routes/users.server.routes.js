'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/uploadPicture').post(users.uploadPictureMobile);

  //User reminder apis
  app.route('/api/users/reminders').post(users.createReminder);
  app.route('/api/users/reminders/remove').post(users.deleteReminder);
    app.route('/api/users/reminders/snooze').post(users.snoozeReminder);
  app.route('/api/users/list-reminders').post(users.listUserReminders);


  

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
  };
