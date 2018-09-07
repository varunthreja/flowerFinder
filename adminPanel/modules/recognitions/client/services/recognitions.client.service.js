(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  // TODO this should be Users service
  angular
  .module('recognitions.admin.services')
  .factory('RecognitionService', RecognitionService);

  RecognitionService.$inject = ['$resource'];

  function RecognitionService($resource) {
    return $resource('/api/recognitions/:recognitionId', {
      recognitionId: '@_id'
      
    }, {
      update: {
        method: 'PUT'
      },
      query :{
        method: 'get', 
        isArray:false
      }
      
    });
  }
}());
