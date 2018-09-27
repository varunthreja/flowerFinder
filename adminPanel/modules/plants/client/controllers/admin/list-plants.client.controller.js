(function () {
  'use strict';

  angular
  .module('plants.admin')
  .controller('PlantListController', PlantListController);

  PlantListController.$inject = ['$scope', '$filter', 'PlantsService','NgTableParams','Authentication','$http','$window','Notification','$location'];

  function PlantListController($scope, $filter, PlantsService,NgTableParams,Authentication,$http,$window,Notification,$location) {
    var vm = this;
    vm.authentication = Authentication;
    vm.loading=true;
    vm.remove = remove;
    vm.applyGlobalSearch = applyGlobalSearch;

    function applyGlobalSearch(){
      var term =  vm.globalSearchTerm;
      /*if ( vm.isInvertedSearch){
        term = "!" + term;
      }*/

     /* vm.tableParams.filter({ $: term });
     vm.tableParams.reload();*/
     //vm.getPlants();
     vm.tableParams.reload();
   }

   vm.redirectToEditItem=function(plantid){
    $location.path('/admin/plants/'+plantid);
  }

    //resest filter if text box cleared
    vm.checkText=function(){

      if(!vm.globalSearchTerm){

        vm.cachedData=[];
        vm.tableParams.filter({ $: '' });
        vm.tableParams.reload();

      }

    }


    vm.getRegions=function(region){
      return _.pluck(region,'text').join(', ');
    }
    //list all plants

    vm.totalItem=0;
    vm.cachedData=[];
    vm.getPlants=function(){

    //using ng table to show data 
    vm.tableParams = new NgTableParams(

    {
      page: 1,           
      count: 20,         
      sorting: {
        created : 'desc' 
      },


    }, {
     /*filterDelay: 300,
     total:  vm.totalItem,*/
     /*total:  0,*/
     getData: function($defer, params) {


       //var newSearchString=vm.globalSearchTerm.replace(/[/(\/)) ]/g, "[/(\/)) ]");
       $http.get('/api/plants',{
        params: {
          pageNumber:params.page(),
          perPageCount:params.count(),
          searchText:  (vm.globalSearchTerm)?vm.globalSearchTerm:'',
        }
      }).success(function(allPlants){



       var orderedRecentActivity = params.sorting() ?
       $filter('orderBy')(allPlants.data, params.orderBy()):
       allPlants.data;

       orderedRecentActivity = params.filter() ?
       $filter('filter')(orderedRecentActivity, params.filter()) :
       orderedRecentActivity;


       params.total(allPlants.total);

         /*if(vm.globalSearchTerm){
          
          $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));

        }else{
          $defer.resolve(orderedRecentActivity);
        }*/

        $defer.resolve(orderedRecentActivity);

        /*$defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/

        vm.loading=false;
      });
    }
  });

  }


  function remove(plant) {
    if ($window.confirm('Are you sure you want to delete this plant?')) {
      if (plant) {

         //plant.$remove();
         PlantsService.remove({},plant, successMessage, errorMessage)


         vm.tableParams.data.splice(vm.tableParams.data.indexOf(plant), 1);
       } else {
        vm.plant.$remove(function () {
          $state.go('admin.plants');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Plant deleted successfully!' });
        });
      }
    }
  }

  function successMessage(response){
    Notification.success('Plant deleted successfully!');
  }

  function errorMessage(error){
    Notification.error('Plant deleted error!');

  }



}
}());
