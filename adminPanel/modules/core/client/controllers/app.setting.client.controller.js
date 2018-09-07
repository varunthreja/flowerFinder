(function () {
  'use strict';

  angular
  .module('core')
  .controller('AppSettingController', AppSettingController);

  AppSettingController.$inject = ['$scope', '$state', 'Authentication', 'menuService','$location','$http','Notification','$sce'];

  function AppSettingController($scope, $state, Authentication, menuService,$location,$http,Notification, $sce) {
    var vm = this;

   // vm.accountMenu = menuService.getMenu('account').items[0];
   vm.authentication = Authentication;
   vm.isCollapsed = false;
   vm.menu = menuService.getMenu('topbar');
   vm.state=$state;
   vm.location=$location;
   /* vm.isEnableEditor=false;*/


   if(vm.authentication &&  vm.authentication.user &&  vm.authentication.user.roles.indexOf('admin')>0){
    vm.showEditButton=true;
  }else{
    vm.showEditButton=false;
  }

  vm.saveHelpContent=saveHelpContent;
  vm.getHelpContent=getHelpContent;

  vm.helpContents='<div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div> <div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div> <div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div> <div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div> <div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div> <div class="devide-line m-b-30"> <p class="Proxima-s-b f-18">How do I recognize a flower/plant ?</p> <p class="m-b-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod and vitality, tempor ut labore et dolore magna aliqua.</p> </div>';

  vm.getHelpContent();

  vm.toggleEditor=function(isView){
    if(isView){
     vm.isEnableEditor=true;
   }else{
     vm.isEnableEditor=false;
   }
 }

 function saveHelpContent(){



   $http.post('/help/content',{helpContents:vm.helpContents}).success(function(response) {

    if(response && response.status=='success'){

      vm.helpContentsBindHtml =$sce.trustAsHtml(vm.helpContents);

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Content saved successfully!' });

    }


  })

 }


 function getHelpContent(){

  $http.get('/help/content').success(function(response) {

    if(response && response.status=='success'){

      if(response.data && response.data.helpContents){

        vm.helpContents=response.data.helpContents;

        vm.helpContentsBindHtml =$sce.trustAsHtml(vm.helpContents);

      }
    }


  })

}



vm.helpContentsBindHtml =$sce.trustAsHtml(vm.helpContents);



   /*vm.goToState=function(state){
    $state.go(state);
  }*/

  

}
}());
