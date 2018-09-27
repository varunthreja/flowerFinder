(function () {
  'use strict';

  angular
  .module('users.admin')
  .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService','NgTableParams','$window','Authentication','$http','Notification','UsersService'];

  function UserListController($scope, $filter, AdminService,NgTableParams,$window,Authentication,$http,Notification,UsersService) {
    var vm = this;
    vm.viewFilter = { 
      isActive : true,
      isInactive : true,
      isDeleted : false,
      isAll : false,
      isIncludeAppUser : false
    }

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.authentication = Authentication;
    vm.loading=true;
    vm.remove = remove;
    vm.changeStatus=changeStatus;
    vm.viewFilteredItems =viewFilteredItems;
    vm.applyGlobalSearch = applyGlobalSearch;
    vm.changeDeleteStatus=changeDeleteStatus;

    //$http.get('/api/test/recognitions')

    function applyGlobalSearch(){
      var term =  vm.globalSearchTerm;
      if ( vm.isInvertedSearch){
        term = "!" + term;
      }
      vm.tableParams.filter({ $: term });
      vm.tableParams.reload();
    }

    //resest filter if text box cleared
    vm.checkText=function(){

      if(!vm.globalSearchTerm){

       vm.tableParams.filter({ $: '' });
       vm.tableParams.reload();

     }

   }
   

    /*$http.post('/api/plants/recognition').success(function(allUsers) {

      console.log("allUsersallUsers",allUsers)
    })
    */

    //When data filter changes
    function viewFilteredItems(){
     //vm.getAllUsers();
     vm.tableParams.reload();
   }


    //list all users
    vm.getAllUsers=function(){

    //using ng table to show data 
    vm.tableParams = new NgTableParams(
    {
      page: 1,           
      count: 10,         
      sorting: {
        created : 'desc' 
      },

    }, {
      getData: function($defer, params) {

       AdminService.query(vm.viewFilter,function (allUsers) {

        var orderedRecentActivity = params.sorting() ?
        $filter('orderBy')(allUsers, params.orderBy()):
        allUsers.data;

        orderedRecentActivity = params.filter() ?
        $filter('filter')(orderedRecentActivity, params.filter()) :
        orderedRecentActivity;


        params.total(orderedRecentActivity.length);
        $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));

        vm.loading=false;
      });
     }
   })

  }

  vm.getUserType=function (roles) {

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


  vm.canModified=function(roles){

    
    if(vm.authentication.user.roles.indexOf('superadmin')>=0 && roles.indexOf('superadmin')<0){
      return true;
    }else if(vm.authentication.user.roles.indexOf('admin')>=0 && roles.indexOf('admin')<0){
      return true;
    }else{
      return false;
    }

  }

  function remove(user) {
    if ($window.confirm('Are you sure you want to delete this user?')) {
      if (user) {
        user.$remove();

        vm.tableParams.data.splice(vm.tableParams.data.indexOf(user), 1);
      //vm.$data.splice(vm.tableParams.data.indexOf(user), 1);
      Notification.success('User deleted successfully!');
    } else {
      vm.user.$remove(function () {
        $state.go('admin.users');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
      });
    }
  }
}


function changeStatus(userId,status){

  UsersService.changeUserStatus(userId,{status:status})
  .then(onChangeStatusSuccess,toggleClass(status,userId))
  .catch(onChangeStatusError)
}


function changeDeleteStatus(user,isDeleted){

  UsersService.changeUserDeleteStatus(user._id,{isDeleted:isDeleted})
  .then(function(response){
    //vm.tableParams.data.splice(vm.tableParams.data.indexOf(user), 1);

    vm.tableParams.data[vm.tableParams.data.indexOf(user)].isDeleted=isDeleted;
    onChangeStatusSuccess(response);
  })
  .catch(onChangeStatusError)
}



function toggleClass(status, elementId){
  var activeLabel=angular.element(document.getElementById('active'+elementId));
  var inactiveLabel=angular.element(document.getElementById('inactive'+elementId));
  if(status){
   activeLabel.attr({'class':'btn  btn-on btn-xs btn-success active'});
   inactiveLabel.attr({'class':'btn btn-default btn-off btn-xs'});
 }else{
   activeLabel.attr({'class':'btn  btn-on btn-xs btn-default'});
   inactiveLabel.attr({'class':'btn btn-off btn-xs active btn-danger'});

 }

}

function onChangeStatusError(response) {
  Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Status update error Error!', delay: 6000 });
}

function onChangeStatusSuccess(response){


  Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User status changed successfully!' });

}

function buildPager() {
  vm.pagedItems = [];
  vm.itemsPerPage = 15;
  vm.currentPage = 1;
  vm.figureOutItemsToDisplay();
}

function figureOutItemsToDisplay() {
  vm.filteredItems = $filter('filter')(vm.users, {
    $: vm.search
  });
  vm.filterLength = vm.filteredItems.length;
  var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
  var end = begin + vm.itemsPerPage;
  vm.pagedItems = vm.filteredItems.slice(begin, end);
}

function pageChanged() {
  vm.figureOutItemsToDisplay();
}
}
}());
