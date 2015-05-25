define(['fk/module'], function(module) {
  
  'use strict';

  module.registerController('FKCtrl', ['$rootScope', '$scope', 'UserService', 'DataService',
    function($rootScope, $scope, userService, dataService) {

    $scope.list = true;

    userService.spaces().then(function(spaces) {
      $scope.spaces = spaces;
    });

    $scope.createDataProvider = function(space) {
      var $container = $('#fk-wizard-widget div.tab-pane[data-smart-wizard-pane="2"]');
      var $title = $container.find('h3 span');
      $title.text('Create New Data Provider');
      $scope.list = false;
    };

    $scope.fkWizardCompleteCallback = function(wizardData) {
      $.smallBox({
        title: "Functional Keywords Framework",
        content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 4000
      });
    };

    $scope.fkWizardStepCallback = function(step, wizardData) {
      switch(step) {
        case 2:
          $scope.data = {};
          var tenant = $rootScope.context.tenant._id;

          dataService.list(tenant, null).then(function(response) {
            $scope.data.public = response;
          });

          var spaces = $scope.spaces;
          $(spaces).each(function() {
            var spaceName = this.name;
            var spaceId = this._id;
            dataService.list(tenant, spaceId).then(function(response) {
              $scope.data[spaceName] = response;
            });
          });
          break;
        default:
          break;
      }
    }
  }]);
})