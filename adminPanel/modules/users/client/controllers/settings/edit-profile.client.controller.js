(function () {
  'use strict';

  angular
  .module('users')
  .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification','Upload','$timeout','PasswordValidator'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification,Upload,$timeout,PasswordValidator) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;
    vm.progress = 0;



    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    //vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.changePasswordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
      .then(onChangePasswordSuccess)
      .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' });
      $scope.showChangePassword=false;
      vm.passwordDetails = {};

    }

    function onChangePasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' });
    }

    $scope.toggleChangePasswordWindow=function(){
      if($scope.showChangePassword)
        $scope.showChangePassword=false;
      else{
        $scope.showChangePassword=true;
        $scope.gotoBottom();
        
      }
    };


    $scope.gotoBottom = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');

          // call $anchorScroll()
         // $anchorScroll();
       };

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {

        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response.user;

        if(vm.picFile){
          vm.upload(vm.picFile);
        }
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }


    vm.upload = function (dataUrl) {

      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      /*Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });
      */
      // Populate user object
      vm.user = Authentication.user = response;
      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }
  }
}());
