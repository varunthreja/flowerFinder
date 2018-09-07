'use strict';


//Setting up basic Authentication



module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  var cron = require('../controllers/cron.server.controller');
  var appSetting = require('../controllers/app-setting.server.controller');



  //test route for cron feature
 //app.route('/test-api-call').get(core.testApiCall);

 app.route('/test-reminder-alert').get(cron.testReminderNotification);

 app.route('/test-reminder-update').get(cron.testUpdateReminder);




  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  app.route('/help/content')
  .get(appSetting.getHelpContent)
  .post(appSetting.setHelpContent);


  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  
  // Define application route
  app.route('/*').get(core.renderIndex);
};
