define(['fk/module'], function(module) {
  
  'use strict';

  module.registerController('FKCtrl', ['$rootScope', '$scope' , 'UserService', 
    function($rootScope, $scope, service) {

    service.spaces().then(function(spaces) {
      $scope.spaces = spaces;
    });

    $scope.fkWizardCompleteCallback = function(wizardData) {
      $.smallBox({
        title: "Functional Keywords Framework",
        content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 4000
      });
    }
  }]);
})