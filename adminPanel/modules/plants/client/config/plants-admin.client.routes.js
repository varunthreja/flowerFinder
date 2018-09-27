(function () {
  'use strict';

  // Setting up route
  angular
  .module('plants.admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('admin.plants', {
      url: '/plants',
      templateUrl: '/modules/plants/client/views/admin/list-plants.client.view.html',
      controller: 'PlantListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Plants List',
        roles :['qa','hr','superadmin']
      }
    })
    .state('admin.plant', {
      url: '/plants/:plantId',
      templateUrl: '/modules/plants/client/views/admin/manage-plant.client.view.html',
      controller: 'PlantController',
      controllerAs: 'vm',
      resolve: {
        plantResolve: getPlant
      },
      data: {
        pageTitle: 'Edit {{ plantResolve.commonName }}',

        roles :['qa','hr','superadmin']
      }
    })
    .state('admin.add-plant', {
      url: '/add-plant',
      templateUrl: '/modules/plants/client/views/admin/manage-plant.client.view.html',
      controller: 'PlantController',
      controllerAs: 'vm',
      resolve: {
        plantResolve: getPlant
      },
      data: {
        pageTitle: 'Add Plant',
        roles :['qa','hr','superadmin']
      }
    });

    getPlant.$inject = ['$stateParams', 'PlantsService'];

    function getPlant($stateParams, PlantsService) {

     if($stateParams.plantId){
      return PlantsService.get({
        plantId: $stateParams.plantId
      }).$promise;

    }else{
      return { 
        moreOptions:[],
        careReminders:[],
      };
    }


  }
}
}());
