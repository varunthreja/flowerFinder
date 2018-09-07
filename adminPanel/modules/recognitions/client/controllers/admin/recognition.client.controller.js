(function () {
  'use strict';

  angular
  .module('recognitions.admin')
  .controller('RecognitionController', RecognitionController);

  RecognitionController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recognitionResolve', 'Notification','RecognitionService','PasswordValidator','$http','$uibModal'];

  function RecognitionController($scope, $state, $window, Authentication, recognition, Notification,RecognitionService,PasswordValidator,$http,$modal) {
    var vm = this;

    vm.authentication = Authentication;
    vm.recognition = recognition;
    vm.loading=false;
    vm.remove = remove;
    vm.update = update;
    vm.isContextRecognitionSelf = isContextRecognitionSelf;
    vm.filterPlants=[];

    vm.loginUserType=getUserType(vm.authentication.user.roles);

    function getUserType(roles) {

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

    vm.selectCallBack=function(selectedPlant){

      if(selectedPlant && selectedPlant.originalObject._id){
       vm.recognition.status="Human Recognition";
       vm.selectedPlant=selectedPlant;
     }

   }

   if(vm.recognition.plantId && vm.recognition.plantId.commonName){
    vm.plantName = vm.recognition.plantId.commonName;
  }

  vm.selectedPlant =  (vm.recognition.plantId)?vm.recognition.plantId:{};

  vm.initialStatus = vm.recognition.status;
  vm.initialPlantId = (vm.recognition.plantId)?vm.recognition.plantId._id:'';

   //vm.selectedPlant = { originalObject :  vm.recognition.plantId }

   vm.recognitionStatus=[
   {status: 'Pending Review'},
   {status: 'Automated Recognition'},
   {status: 'Not Recognized'},
   {status: 'Human Recognition'},
   {status: 'Invalid Image'},
   ];


   $scope.createAndPlant = function () {


    var createAndPlantModalInstance = $modal.open({
      templateUrl:'/modules/plants/client/views/admin/manage-plant.client.view.html',
      scope: $scope,
      backdrop: 'static',
        controller: 'CreateAndAddPlantController',/*function($scope, $uibModalInstance) {
          $scope.ok = function() {
            $uibModalInstance.close();
          };



          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };


          $uibModalInstance.close();
            //$uibModalInstance.dismiss('cancel');
          }*/
        });


    createAndPlantModalInstance.result.then(function (plant) {


     var selectedPlant = {_id:plant._id,
       commonName : plant.commonName,
       scientificName : plant.scientificName,
       originalObject : plant
     };
     vm.recognition.plantId=plant._id;
     vm.recognition.status="Human Recognition";

     $scope.$broadcast('angucomplete-alt:changeInput', 'plants_autocomplete',selectedPlant);
     //vm.$scope.$broadcast('angucomplete-alt:changeInput', id, value);


   });



  };

  vm.inputChangedFn =function(item){

    if(vm.selectedPlant && vm.selectedPlant.originalObject && vm.selectedPlant.originalObject._id && item){
      //alert()
     // vm.recognition.status="Human Recognition";
   }else if(item===''){
     vm.recognition.plantId=null;
     vm.selectedPlant={};
     vm.recognition.status=vm.initialStatus;

   }
   return item;
 }


 vm.onSelect = function ($item, $model, $label) {

    //assing a new plant to recognition when select
    vm.recognition.plantId=$model._id;
    vm.recognition.status="Human Recognition";
  };

  vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

  vm.checkIfInvalidImage=function(){
    if(vm.invalidImage){
      vm.recognition.status='Invalid Image';
    }else{
      vm.recognition.status=vm.initialStatus;
    }
  }

  vm.searchPlants=function(item){

    return;

    if(vm.plantName.length<3){
      return false;
    }

    vm.loading=true;

    $http.get('/api/plants',{
      params: {
        pageNumber:1,
        perPageCount:100,
        searchText:  (vm.plantName)?vm.plantName:'',
      }
    }).success(function(allPlants){

      vm.filterPlants=allPlants.data;
      vm.loading=false;
      //$scope.$digest();

    }).error(function(errorResponse){

    });
  }

  vm.searchResponseFormatter = function(response){


    if(response.data.length>0){
      angular.forEach(response.data, function(item,key){
        if(item.pictures && item.pictures.length>0){
          var imageUrlThumb=item.pictures[0].split('.')[0]+'_thumb.'+item.pictures[0].split('.')[1];
          response.data[key]['imageUrl']='/'+imageUrlThumb;
        }else{
          response.data[key]['imageUrl']='/modules/plants/client/img/default-plant.png';
        }
      })

    }

    return response;

  }

  function remove(recognition) {
    if ($window.confirm('Are you sure you want to delete this recognition?')) {
      if (recognition) {
        recognition.$remove();

        vm.recognitions.splice(vm.recognitions.indexOf(recognition), 1);
        Notification.success('Recognition deleted successfully!');
      } else {
        vm.recognition.$remove(function () {
          $state.go('admin.recognitions');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Recognition deleted successfully!' });
        });
      }
    }
  }

  function update(isValid) {

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'manageRecognitionForm');
      return false;
    }

    if(vm.selectedPlant && !vm.selectedPlant.originalObject && !vm.invalidImage){


     if(!confirm('Please select or add a plant.')){
      return false;
    }else {
      return false;
    }

    
  }


  if(vm.selectedPlant && vm.selectedPlant.originalObject && vm.selectedPlant.originalObject._id){
    vm.recognition.plantId=vm.selectedPlant.originalObject._id;
  }



  if(vm.initialPlantId!==vm.recognition.plantId){
    if(!confirm('Are you sure, you want to update plant for the recognition request?')){
      return false;
    }
  }

  if(vm.recognition.status==='Invalid Image'){
    vm.recognition.plantId=null;
  }

  var recognition = vm.recognition;

  if(recognition._id){
    recognition.isFromAdmin=true;

    recognition.$update(function () {
     Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Recognition saved successfully!' });
      $state.go('admin.recognitions')/*, {
        recognitionId: recognition._id
      });*/

    }, function (errorResponse) {
      Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Recognition update error!' });
    });

  }else{


     /* RecognitionService.recognitionSignup(recognition).then(onRecognitionSignupSuccess)
     .catch(onRecognitionSignupError);*/


     var newRecognition = new RecognitionService(recognition);
     newRecognition.$save(onRecognitionCreateSuccess,onRecognitionCreateError)


   }



 }

 function onRecognitionCreateSuccess(response) {
      // If successful we assign the response to the global recognition model

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Recognition created successfully!' });

     // vm.recognition={};
      // And redirect to the previous or home page
      $state.go($state.previous.state.name, $state.previous.params);
    }

    function onRecognitionCreateError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function isContextRecognitionSelf() {
      return vm.recognition.recognitionname === vm.authentication.recognition.recognitionname;
    }
  }
}());
