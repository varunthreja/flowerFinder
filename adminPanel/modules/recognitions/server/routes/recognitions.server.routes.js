'use strict';

var adminPolicy = require('../policies/admin.server.policy');
// User Routes
var recognitions = require('../controllers/recognitions.server.controller');


module.exports = function (app) {

  app.route('/api/user/recognitions')
  .post(recognitions.userRecognitionList);

   // Users collection routes
   app.route('/api/recognitions')
   .get(adminPolicy.isAllowed, recognitions.list)
   .post(recognitions.recognizeFlower);

   app.route('/api/plants/recognition')
   .post(recognitions.recognizeFlower);

   app.route('/api/test/recognitions')
   .get(recognitions.test);

   /*app.route('/api/recognitions/botany')
   .post(recognitions.sendToBotany);*/

  // Single user routes
  app.route('/api/recognitions/:recognitionId')
  .get(recognitions.read)
  .put(recognitions.update)
  .delete(recognitions.delete);

  app.route('/api/statics/recognitions')
  .get(recognitions.recognitionStatusChart);



  

  // Finish by binding the user middleware
  app.param('recognitionId', recognitions.recognitionByID);
};
