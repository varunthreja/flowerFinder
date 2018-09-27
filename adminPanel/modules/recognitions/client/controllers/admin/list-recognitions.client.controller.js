(function () {
  'use strict';

  angular
  .module('recognitions.admin')
  .controller('RecognitionListController', RecognitionListController);

  RecognitionListController.$inject = ['$scope', '$filter', 'NgTableParams','$window','Authentication','$http','Notification','RecognitionService','$location'];

  function RecognitionListController($scope, $filter,NgTableParams,$window,Authentication,$http,Notification,RecognitionService,$location) {
    var vm = this;
    vm.viewFilter = "Pending Review";
    vm.authentication = Authentication;

    vm.recognitionStatus=[
    {status: 'All'},
    {status: 'Pending Review'},
    {status: 'Automated Recognition'},
    {status: 'Not Recognized'},
    {status: 'Human Recognition'},
    {status: 'Invalid Image'},
    ]


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

    //vm.location=$location;
    vm.redirectToEditItem=function(recognitionId){
      $location.path('/admin/recognitions/'+recognitionId);
    }

    
    
    vm.loading=true;
    vm.remove = remove;
    vm.changeStatus=changeStatus;
  //  vm.viewFilteredItems =viewFilteredItems;
  vm.applyGlobalSearch = applyGlobalSearch;

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
   
   vm.viewFilteredItem=function(){

    if(!vm.viewFilter){
      return false;
    }
    vm.loading=true;
    vm.tableParams.reload();
    //vm.getAllRecognitions();
  }




    //list all recognition
    vm.getAllRecognitions=function(){

    //using ng table to show data 
    vm.tableParams = new NgTableParams(
    {
      page: 1,           
      count: 20,         
     /* sorting: {
        created : 'asc' 
      },*/

    }, {
      getData: function($defer, params) {


        var hrUserId='';

        if(vm.getUserType(vm.authentication.user.roles)==='HR'){
          hrUserId=vm.authentication.user._id;
        }


        if(vm.globalSearchTerm){
          var orderedRecentActivity = params.sorting() ?
          $filter('orderBy')($scope.currentPageData, params.orderBy()):
          allRecognitions.data;

          orderedRecentActivity = params.filter() ?
          $filter('filter')(orderedRecentActivity, params.filter()) :
          orderedRecentActivity;


          params.total(params.count());
          $defer.resolve(orderedRecentActivity);
           vm.loading=false;

        }else{

          RecognitionService.query({
            recognitionsViewtype : vm.viewFilter,
            pageNumber:params.page(),
            perPageCount:params.count(),
            searchText:  (vm.globalSearchTerm)?vm.globalSearchTerm:'',
            hrUserId:hrUserId,
          },function (allRecognitions) {


            $scope.currentPageData=allRecognitions.data;

            var orderedRecentActivity = params.sorting() ?
            $filter('orderBy')(allRecognitions.data, params.orderBy()):
            allRecognitions.data;

            orderedRecentActivity = params.filter() ?
            $filter('filter')(orderedRecentActivity, params.filter()) :
            orderedRecentActivity;


            params.total(allRecognitions.total);
            /*$defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/

            $defer.resolve(orderedRecentActivity);

            vm.loading=false;
          });

        }
        
      }
    })

  }


  function remove(user) {
    if ($window.confirm('Are you sure you want to delete this user?')) {
      if (user) {
        user.$remove();

        vm.tableParams.data.splice(vm.tableParams.data.indexOf(user), 1);
      //vm.$data.splice(vm.tableParams.data.indexOf(user), 1);
      Notification.success('Recognition deleted successfully!');
    } else {
      vm.user.$remove(function () {
        $state.go('admin.recognition');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Recognition deleted successfully!' });
      });
    }
  }
}


function changeStatus(userId,status){

  RecognitionsService.changeRecognitionStatus(userId,{status:status})
  .then(onChangeStatusSuccess,toggleClass(status,userId))
  .catch(onChangeStatusError)
}


function changeDeleteStatus(userId,isDeleted){

  RecognitionsService.changeDeleteStatus(userId,{isDeleted:isDeleted})
  .then(onChangeStatusSuccess)
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


  Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Recognition status changed successfully!' });

}

function buildPager() {
  vm.pagedItems = [];
  vm.itemsPerPage = 15;
  vm.currentPage = 1;
  vm.figureOutItemsToDisplay();
}

function figureOutItemsToDisplay() {
  vm.filteredItems = $filter('filter')(vm.recognition, {
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
