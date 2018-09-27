(function () {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService','$location'];

  function HeaderController($scope, $state, Authentication, menuService,$location) {
    var vm = this;

   // vm.accountMenu = menuService.getMenu('account').items[0];
   vm.authentication = Authentication;
   vm.isCollapsed = false;
   vm.menu = menuService.getMenu('topbar');
   vm.state=$state;
   vm.location=$location;

   vm.goToState=function(state){
    $state.go(state);
  }

  $scope.$on('$stateChangeSuccess', stateChangeSuccess);

  function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }


  }
}());
