(function () {
  'use strict';

  // Users directive used to force lowercase input
  angular
  .module('users')
  .directive('lowercase', lowercase)
  .directive('checkFieldAsync',checkFieldAsync)

  checkFieldAsync.$inject = ['DataService'] ;

  function checkFieldAsync(DataService){

   return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      elem.bind('blur', function() {
        ctrl.__CHECKING_FIELD = true;
        var keyProperty = scope.$eval(attrs.checkFieldAsync),
        currentValue = elem.val();
        DataService.isDuplicateEmailAsync(keyProperty.key, keyProperty.property, currentValue, keyProperty.type).then(function(hasEmail) {
          ctrl.$setValidity('isDuplicatedEmail', !hasEmail);
        })['finally'](function() {
          ctrl.__CHECKING_FIELD = false;
        });
      });
    }
  };
}



function lowercase() {
  var directive = {
    require: 'ngModel',
    link: link
  };

  return directive;

  function link(scope, element, attrs, modelCtrl) {
    modelCtrl.$parsers.push(function (input) {
      return input ? input.toLowerCase() : '';
    });
    element.css('text-transform', 'lowercase');
  }
}
}());
