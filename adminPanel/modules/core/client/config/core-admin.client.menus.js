(function () {
  'use strict';

  angular
  .module('core.admin')
  .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    /*menuService.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });*/

    menuService.addMenuItem('topbar',{
      title: 'Manage Recognitions',
      state: 'admin.recognitions',
      roles:['qa','hr','superadmin'],
      icon:'glyphicon glyphicon-list'

    });
  }
}());
