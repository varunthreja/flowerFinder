(function () {
  'use strict';

  // Users service used for communicating with the plants REST endpoint
  angular
  .module('plants.admin.services')
  .factory('PlantsService', PlantsService);

  PlantsService.$inject = ['$resource'];

  function PlantsService($resource) {

    var Plants = $resource('/api/plants/:plantId', {
      plantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });



    return Plants;
  }

}());
