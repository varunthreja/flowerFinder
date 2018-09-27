(function () {
  'use strict';

  angular
  .module('users.admin')
  .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification','UsersService','PasswordValidator'];

  function UserController($scope, $state, $window, Authentication, user, Notification,UsersService,PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.loading=true;
    vm.user = user;
    vm.loading=false;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    if(!vm.user._id){
      vm.user.roles=['user','hr'];
    }


    vm.userTypeSelect=function(userType){

      if(userType==='qa'){
        vm.user.roles=['user','hr','qa'];

      }else if(userType==='hr'){
       vm.user.roles=['user','hr'];

     }else if(userType==='admin'){
       vm.user.roles=['user','hr','qa','admin'];

     }else if(userType==='superadmin'){
       vm.user.roles=['user','hr','qa','admin','superadmin'];
     }else{
       vm.user.roles=['user']

     }

   }

   vm.getUserType=function () {
    var roles =vm.user.roles;

    if(!roles){
      return false;
    }  

    if(roles.indexOf('superadmin')>=0){
      return "SuperAdmin";
    }else if(roles.indexOf('admin')>=0){
      return "Admin";
    }else if(roles.indexOf('qa')>=0){
      return "QA";
    }else if(roles.indexOf('hr')>=0){
      return "HR";
    }else if(roles.indexOf('user')>=0){
      return "User";
    }
  }


  


  function remove(user) {
    if ($window.confirm('Are you sure you want to delete this user?')) {
      if (user) {
        user.$remove();

        vm.users.splice(vm.users.indexOf(user), 1);
        Notification.success('User deleted successfully!');
      } else {
        vm.user.$remove(function () {
          $state.go('admin.users');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
        });
      }
    }
  }

  function update(isValid) {


    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'manageUserForm');

      return false;
    }

    var user = vm.user;

    if(user._id){

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });

    }else{


     /* UsersService.userSignup(user).then(onUserSignupSuccess)
     .catch(onUserSignupError);*/


     var newUser = new UsersService(user);
     newUser.$save(onUserCreateSuccess,onUserCreateError)


   }



 }

 function onUserCreateSuccess(response) {
      // If successful we assign the response to the global user model

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User created successfully!' });

     // vm.user={};
      // And redirect to the previous or home page
      $state.go($state.previous.state.name, $state.previous.params);
    }

    function onUserCreateError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
