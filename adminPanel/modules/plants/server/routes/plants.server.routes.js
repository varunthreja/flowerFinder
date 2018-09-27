'use strict';


var adminPolicy = require('../policies/admin.server.policy');

var plants = require('../controllers/plants.server.controller');

module.exports = function (app) {
  // User Routes
  

  app.route('/api/plants/import').get(plants.importPlants);



    // Users collection routes
    app.route('/api/plants')
    .get(adminPolicy.isAllowed, plants.list)
    .post(plants.create);


    // Users collection routes
    app.route('/api/plants/picture/:plantId')
    .post(plants.uploadPicture);


    app.route('/api/getPlaces')
    .get(plants.getPlaces);

    

  // Single user routes
  app.route('/api/plants/:plantId')
  .get(adminPolicy.isAllowed, plants.read)
  .put(adminPolicy.isAllowed, plants.update)
  .delete(adminPolicy.isAllowed, plants.delete);

  // Finish by binding the user middleware
  app.param('plantId', plants.plantByID);




  app.route('/api/getPlant/:plantID')
  .post(plants.plantByIdApi)

  app.route('/api/search/plants')
  .post(plants.searchListApi)

  



};
