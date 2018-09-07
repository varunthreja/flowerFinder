(function () {
  'use strict';

  angular
  .module('users.admin')
  .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Manage Users',
      roles:['admin','superadmin'],
      state: 'admin.users',
      icon:'fa fa-users'
    });
  }
}());
