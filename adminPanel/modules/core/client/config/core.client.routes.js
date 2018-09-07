(function () {
  'use strict';

  angular
  .module('core.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
    .state('home', {
     url: '/',
     templateUrl: '/modules/users/client/views/authentication/login.client.view.html',
     controller: 'AuthenticationController',
     controllerAs: 'vm',
     data: {
      pageTitle: 'Signin'
    }
  })
    $stateProvider
    .state('help-center', {
     url: '/help-center',
     templateUrl: '/modules/core/client/views/help.client.view.html',
     controller: 'AppSettingController',
     controllerAs: 'vm',
     data: {
      pageTitle: 'Help'
    }
  })



    .state('web-view', {
      abstract: true,
      url: '/web-view',
      templateUrl: '/modules/core/client/views/web-views/web-view.client.view.html',
      /*controller: 'SettingsController',
      controllerAs: 'vm',*/
      
    })
    $stateProvider
    .state('web-view.help', {
     url: '/help',
     templateUrl: '/modules/core/client/views/web-views/help-center-device.client.view.html',
     controller: 'AppSettingController',
     controllerAs: 'vm',
     data: {
      pageTitle: 'Help Center'
    }
  })

    $stateProvider
    .state('web-view.terms', {
     url: '/terms',
     templateUrl: '/modules/core/client/views/web-views/terms-of-use-device.client.view.html',
     data: {
      pageTitle: 'Terms'
    }
  })
    $stateProvider
    .state('web-view.privacy-policy', {
     url: '/privacy-policy',
     templateUrl: '/modules/core/client/views/web-views/privacy-policy-device.client.view.html',
     data: {
      pageTitle: 'Privacy Policy'
    }
  })
    .state('not-found', {
      url: '/not-found',
      templateUrl: '/modules/core/client/views/404.client.view.html',
      controller: 'ErrorController',
      controllerAs: 'vm',
      params: {
        message: function($stateParams) {
          return $stateParams.message;
        }
      },
      data: {
        ignoreState: true,
        pageTitle: 'Not Found'
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: '/modules/core/client/views/400.client.view.html',
      controller: 'ErrorController',
      controllerAs: 'vm',
      params: {
        message: function($stateParams) {
          return $stateParams.message;
        }
      },
      data: {
        ignoreState: true,
        pageTitle: 'Bad Request'
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: '/modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true,
        pageTitle: 'Forbidden'
      }
    });
  }
}());
