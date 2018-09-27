(function () {
  'use strict';

  angular
    .module('plants.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar',{
      title: 'Manage Plants',
      state: 'admin.plants',
      icon:'fa fa-pagelines',
      roles:['qa','hr','superadmin']
    });
  }
}());
