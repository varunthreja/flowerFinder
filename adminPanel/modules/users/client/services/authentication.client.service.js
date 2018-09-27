(function () {
  'use strict';

  // Authentication service for user variables

  angular
  .module('users.services')
  .factory('Authentication', Authentication)
  .service('DataService', DataService);


  DataService.$inject = ['$http', '$q'];

  function DataService($http, $q) {
    this.isDuplicateEmailAsync = function(id, property, value,type) {

      if (!id) id = 0;
      var deferred = $q.defer(), i;
      $http.post('/auth/checkUnique'+type, {'id':id,property:property,'value':value})
      .success(function(response) {
        deferred.resolve(response);
        if(response===true){
          return;
        }
      })
      .error(function() {
        deferred.resolve(false);
      });

      return deferred.promise;
    };
  }

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());
