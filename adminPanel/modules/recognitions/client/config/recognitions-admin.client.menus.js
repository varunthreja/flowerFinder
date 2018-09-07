(function () {
  'use strict';

  angular
  .module('recognitions.admin')
  .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    /*menuService.addMenuItem('topbar',{
      title: 'Manage Recognize',
      state: 'admin.recognitions',
      roles:['qa','hr','superadmin'],
      icon:'glyphicon glyphicon-list'

    });*/
  }
}());
