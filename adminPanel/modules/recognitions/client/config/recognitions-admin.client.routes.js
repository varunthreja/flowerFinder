(function () {
  'use strict';

  // Setting up route
  angular
  .module('recognitions.admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('admin.recognitions', {
      url: '/recognitions',
      templateUrl: '/modules/recognitions/client/views/admin/list-recognitions.client.view.html',
      controller: 'RecognitionListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Recognitions List'
      }
    })
    .state('admin.recognition', {
      url: '/recognitions/:recognitionId',
      templateUrl: '/modules/recognitions/client/views/admin/manage-recognition.client.view.html',
      controller: 'RecognitionController',
      controllerAs: 'vm',
      resolve: {
        recognitionResolve: getRecognition
      },
      data: {
        pageTitle: 'Edit {{ recognitionResolve.displayName }}'
      }
    })
    .state('admin.recognition-edit', {
      url: '/recognitions/:recognitionId/edit',
      templateUrl: '/modules/recognitions/client/views/admin/edit-recognition.client.view.html',
      controller: 'RecognitionController',
      controllerAs: 'vm',
      resolve: {
        recognitionResolve: getRecognition
      },
      data: {
        pageTitle: 'Edit Recognition {{ recognitionResolve.displayName }}'
      }
    });

    getRecognition.$inject = ['$stateParams', 'RecognitionService'];

    function getRecognition($stateParams, RecognitionService) {
      return RecognitionService.get({
        recognitionId: $stateParams.recognitionId
      }).$promise;
    }
  }
}());
