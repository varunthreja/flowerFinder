(function () {
  'use strict';

  angular
  .module('plants.admin')
  .factory('initee',Init)
  .controller('PlantController', PlantController)
 /* .directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
      iElement.autocomplete({
        source: scope[iAttrs.uiItems],
        select: function() {
          $timeout(function() {
            iElement.trigger('input');
          }, 0);
        }
      });
    };
  });*/

  function Init() {

   return {
     init : function(){

     }
   }
 }

 PlantController.$inject = ['$scope', '$state', '$window', 'Authentication', 'plantResolve', 'Notification','Upload','initee','$http','$timeout','PlantsService'];

 function PlantController($scope, $state, $window, Authentication, plant, Notification,Upload,initee,$http,$timeout,PlantsService) {
  var vm = this;

  vm.authentication = Authentication;
  vm.plant = plant;
  vm.remove = remove;
  vm.update = update;
  vm.addRemoveMoreOption=addRemoveMoreOption;
  vm.addRemoveMoreReminder=addRemoveMoreReminder;

  vm.removeImage=removeImage;
  vm.item={};
  vm.reminder ={ type : 'Daily'};
  vm.checkIfOther=checkIfOther;
  vm.isCustomReminder=false;

  function checkIfOther(){
    if(vm.reminder.type=='Other'){
      vm.isCustomReminder=true;
    }else{
      vm.isCustomReminder=false;
    }
  }

  vm.dt  ='';


  vm.resetManagePlantForm =function(){
    vm.item={};
    vm.reminder ={ type : 'Daily'};
    vm.plant = plant;
  }


  $scope.today = function() {
    vm.dt  = new Date();
    vm.dt.setDate(vm.dt.getDate()+1); 
  };
  $scope.today();

  $scope.clear = function() {
    vm.dt  = null;
  };

 
  $scope.dateOptions = {
    /*  dateDisabled: disabled,*/
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };



  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    vm.dt  = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };



  /*
  Time picker
  */

  var fullYear=vm.dt.getFullYear();
  var month=vm.dt.getMonth();
  var day=vm.dt.getDate();

  vm.reminder.customDateTime = new Date(fullYear,month,day,9,30,0);

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  vm.timeUpdate = function() {
    /*var d = new Date(vm.dt);
    d.setHours( 14 );
    d.setMinutes( 0 );
    vm.reminder.customDateTime = d;*/
    fullYear=vm.dt.getFullYear();
    month=vm.dt.getMonth();
    day=vm.dt.getDate();
    vm.reminder.customDateTime.setMonth(month);
    vm.reminder.customDateTime.setFullYear(fullYear);
    vm.reminder.customDateTime.setDate(day);
    console.log('vm.reminder.customDateTimevm.reminder.customDateTime',vm.reminder.customDateTime)


  };

  $scope.changed = function () {
   fullYear=vm.dt.getFullYear();
   month=vm.dt.getMonth();
   day=vm.dt.getDate();
   vm.reminder.customDateTime.setMonth(month);
   vm.reminder.customDateTime.setFullYear(fullYear);
   vm.reminder.customDateTime.setDate(day);
   console.log('Time changed to: ' + vm.reminder.customDateTime, vm.dt );
 };

 $scope.clear = function() {
  vm.reminder.customDateTime = null;
};
  /*
  End Time Picker
  */



  var d = new Date()
  var gmtHours = -d.getTimezoneOffset()/60;
  console.log("The local time zone is: GMT " + gmtHours);


  $scope.moreOptions = [ 
  {name: 'Height', code: 'AF'},
  {name: 'Width', code: 'AG'},
  {name: 'Color', code: 'BS'},
  {name: 'Spread', code: 'KH'},
  {name: 'Special features', code: 'KH'},
  {name: 'Pest and Problems', code: 'KH'},
  {name: 'Design suggestion', code: 'KH'},
  {name: 'Water requirements', code: 'KH'},  
  {name: 'Maintenance level', code: 'KH'},
  {name: 'Rate of growth', code: 'KH'},
  {name: 'Light Exposure', code: 'CV'},
  {name:'Growing tips',code:'GT'}
  ];


  vm.allReminders = [ 
  {name: 'Daily', id: 1,detail:'9:30 AM local time'},
  {name: 'Twice weekly', id: 2,detail:'9:30 AM Wednesday and Saturday'},
  {name: 'Weekly', id: 3,detail:'9:30 AM local time Saturday'},
  {name: 'Every two weeks', id: 4,detail:'9:30 AM every other Saturday'},
  {name: 'Monthly', id: 5,detail:'9:30 AM first day of the month'},
  {name: 'Quarterly', id: 6,detail:'9:30 AM Jan1, April 1, July 1, and Oct 1'},
  {name: 'Every six months', id: 7,detail:'9:30 AM April 1 and Oct 1'},
  {name: 'Season: Spring', id: 8,detail:'9:30 AM March 20'},  
  {name: 'Season: Fall', id: 9,detail:'9:30 AM September 22'},
  {name: 'Season: Winter', id: 10,detail:'9:30 AM Dec 21'},
  {name: 'Season: Summer', id: 11,detail:'9:30 AM June 20'},
  {name: 'Other',id:12,detail:'Custom date time'}
  ];

  function addRemoveMoreOption(isAdd,item){
    if(isAdd){
      var nameAttr=(typeof item.name === "object")?item.name.name:item.name;
      item.name=nameAttr;
      var names=_.pluck(vm.plant.moreOptions,'name');
      if(names.length>0 && names.indexOf(nameAttr)>=0){
        return false;
      }
      vm.plant.moreOptions.push({name:nameAttr,value:item.value});
      vm.item={};
    }else{
      vm.plant.moreOptions.splice(vm.plant.moreOptions.indexOf(item),1);
    }
  }


  function addRemoveMoreReminder(isAdd,item){

    if(isAdd){

     var names=_.pluck(vm.plant.careReminders,'name');
     if(names.length>0 && names.indexOf(item.name)>=0){
      return false;
    }

    if(item.type!=='Other'){
      delete item.customDateTime;
    }

    vm.plant.careReminders.push(item);
    vm.reminder={type:'Daily'};
    vm.reminder.customDateTime = new Date(fullYear,month,day,9,30,0);
    vm.isCustomReminder=false;
  }else{
   vm.plant.careReminders.splice(vm.plant.careReminders.indexOf(item),1);
 }
}

  //checkIfMoreOption();
  
  $scope.tags = ['test','india','us'];
  vm.invalidTag =function(tag){

    if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(tag.text)){

     alert('Invalid tag : Special charactor not allowed');
     return false;
   }else{
    return true;
  }
}

$scope.loadTags = function(query) {


 if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(query)){
  return false;
}


$scope.filterTag=[];
return $http.get('/api/getPlaces?search='+query).then(function(response){

  var data=response.data.predictions;
  $scope.filterTag=_.pluck(data,'description');
  return $scope.filterTag;

})


};

function removeImage(image){

  $scope.slides.splice($scope.slides.indexOf(image),1);
  vm.plant.pictures.splice(vm.plant.pictures.indexOf(image.url),1);
}

function remove(plant) {
  if ($window.confirm('Are you sure you want to delete this plant?')) {
    if (plant) {
      plant.$remove();

      vm.plants.splice(vm.plants.indexOf(plant), 1);
      Notification.success('Plant deleted successfully!');
    } else {
      vm.plant.$remove(function () {
        $state.go('admin.plants');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Plant deleted successfully!' });
      });
    }
  }
}

function update(isValid) {
  if (!isValid) {
    $scope.$broadcast('show-errors-check-validity', 'vm.managePlantForm');

    return false;
  }

  var plant = vm.plant;


  if(plant._id){

    plant.$update(function () {

      if(vm.files)
        uploadPlantFiles(plant._id, vm.files);

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Plant saved successfully!' });

      $state.go('admin.plants');
    }, function (errorResponse) {
      Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Plant update error!' });
    });

  }else{


    var newPlant = new PlantsService(plant);
    newPlant.$save(onPlantCreateSuccess,onPlantCreateError)



  }

}


function onPlantCreateSuccess(response){


  Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Plant saved successfully!' });
  if(vm.files)
    uploadPlantFiles(response.plant._id, vm.files);
  $state.go('admin.plants');

}


function onPlantCreateError(error){

 Notification.error({ message: error.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Plant create error!' });

}




function uploadPlantFiles (plantId, files) {

  Upload.upload({
    url: '/api/plants/picture/'+plantId,
    arrayKey: '',
    data: {
      files: files
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


$scope.isDelete=function(imageId){
  if(imageId)
    $scope.isDeleteImage=true;
  else
    $scope.isDeleteImage=true;
}

$scope.noWrapSlides = false;
$scope.myInterval = 3000;
$scope.slides=[];
for(var i in vm.plant.pictures){
  $scope.slides.push({image:'/'+vm.plant.pictures[i],id:i,url:vm.plant.pictures[i]})
}





    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      /*Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });*/

      
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

