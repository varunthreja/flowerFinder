(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
  .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
  .module(app.applicationModuleName)
  .config(bootstrapConfig)
  .run([/*'Base64',*/ '$http','$stateParams', '$rootScope','$state', function(/*Base6*/ $http,$stateParams,$rootScope,$state) {

    var authdata = btoa('admin' + ':' + '9EABB4E1BE58D18FF12C7D5827961');
    /*var authdata = Base64.encode('admin' + ':' + '9EABB4E1BE58D18FF12C7D5827961');*/
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; 
     /*$rootScope.$state = $state;
     $rootScope.$stateParams = $stateParams;*/


     $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
      // to be used for back button //won't work when page is reloaded.
      $rootScope.previousState_name = fromState.name;
      $rootScope.previousState_params = fromParams;
    });

    //back button function called from back button's ng-click="back()"
    $rootScope.backState = function() {

      //console.log(JSON.stringify(event));

      /*if ($event.keyCode == 13) {
        $event.preventDefault();
      }*/

      $state.go($rootScope.previousState_name, $rootScope.previousState_params);
    };
  }
  ]);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider','$provide'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider,$provide) {


    $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
            ['html', /*'insertImage',*/ 'insertLink', 'wordcount', 'charcount']
            ];
          /*  taOptions.classes = {
              focussed: 'focussed',
              toolbar: 'btn-toolbar',
              toolbarGroup: 'btn-group',
              toolbarButton: 'btn btn-default',
              toolbarButtonActive: 'active',
              disabled: 'disabled',
              textEditor: 'form-control',
              htmlEditor: 'form-control'
            };*/
            return taOptions; // whatever you return will be the taOptions
          }]);
        // this demonstrates changing the classes of the icons for the tools for font-awesome v3.x
        

        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        }).hashPrefix('!');

        $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }


  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);

    
  }
}(ApplicationConfiguration));
