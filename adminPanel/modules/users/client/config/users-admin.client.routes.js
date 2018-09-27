(function () {
  'use strict';

  // Setting up route
  angular
  .module('users.admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('admin.users', {
      url: '/users',
      templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
      controller: 'UserListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Users List'
      }
    })
    .state('admin.user', {
      url: '/users/:userId',
      templateUrl: '/modules/users/client/views/admin/manage-user.client.view.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: {
        userResolve: getUser
      },
      data: {
        pageTitle: 'Edit {{ userResolve.displayName }}'
      }
    })
    .state('admin.add-user', {
      url: '/add-user',
      templateUrl: '/modules/users/client/views/admin/manage-user.client.view.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: {
        userResolve: getUser
      },
      data: {
        pageTitle: 'Add User'
      }
    })
    .state('admin.user-edit', {
      url: '/users/:userId/edit',
      templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: {
        userResolve: getUser
      },
      data: {
        pageTitle: 'Edit User {{ userResolve.displayName }}'
      }
    });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {

      if($stateParams.userId){
        return AdminService.get({
          userId: $stateParams.userId
        }).$promise;

      }else{

        return {};
      }
      
    }
  }
}());
