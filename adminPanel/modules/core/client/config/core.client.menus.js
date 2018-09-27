(function () {
  'use strict';

  angular
  .module('core')
  .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {


    menuService.addMenuItem('topbar', {
      title: 'Profile Settings',
      state: 'profile',
      icon:'glyphicon glyphicon-user'
    });

   /* menuService.addMenuItem('topbar', {
      title: 'Help Center',
      state: 'help-center',
      icon:'glyphicon glyphicon-question-sign'
    });*/

    
    /*menuService.addMenuItem('settings', {
      icon:'glyphicon glyphicon-user',
      state: 'settings',
      title: 'settings',
      roles: ['user']
    });
    */
   /* menuService.addMenuItem('settings', {
      icon:'glyphicon glyphicon-off',
      state: '/api/auth/signout',
      title: 'Signout',
      roles: ['user']
    });*/

    /*menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });*/
  }
}());
