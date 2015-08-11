define(['performance/module', 'lodash', 'morris', 'notification'], function (module, _) {
  
  'use strict';
   
  module.registerController('PerformanceExeCtrl', ['$scope', '$state', '$stateParams', '$compile', '$templateRequest', 'ScriptService', 'PerformanceService', function($scope, $state, $stateParams, $compile, $templateRequest, ScriptService, PerformanceService) {
    
    $scope.samplerReport = true; 
 		$scope.projectId = $stateParams.id;
    var selected = [];
 		$scope.title = "EXECUTION";

    ScriptService.list($scope.projectId, function(response) {
      $scope.scripts = response;
      $scope.totalScripts = response.totalScripts;
    });

    PerformanceService.get($scope.projectId, function (response) {
      $scope.project = response;
      checkProjectStatus();
    });

    var checkProjectStatus = function() {
        if ($scope.project.status == 'RUNNING') {
          $.SmartMessageBox({
            title: "Project Execution Alert!",
            content: "Your project has been already running. Please back to overivew tab to track project progress",
            buttons: '[Go to overview]'
          }, function (ButtonPressed) {
            if (ButtonPressed === "Go to overview") {
              $state.go('app.performance', {id: $scope.projectId});
            }
          });
          return false;
        }

        return true;
    }
    // handle when user selects scripts
    $scope.selectScript = function (scriptId) {
      var $btnRun = $('.btn.btn-primary.btn-performance-run');
      if (_.indexOf(selected, scriptId) != -1) {
          _.remove(selected, function(sel) {
            return sel == scriptId;
          });
        } else {
          selected.push(scriptId);
        }

      if (selected.length > 0) $btnRun.removeClass('disabled');
      else $btnRun.addClass('disabled');
    }

    //run project with projectid and list scripts
    $scope.runPerformanceTest = function () {

      if (checkProjectStatus())
      PerformanceService.run($stateParams.id, selected, function(data, status) {
        switch (status) {
          case 200:
              $.smallBox({
                title: 'Notification',
                content: 'You have submitted project job',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: 'Notification',
                content: 'Your project has been already running',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: 'Notification',
                content: 'Can not submmit your project job',
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

        }
        $state.go('app.performance', {id : $scope.projectId});
      });
    }

  }]);
});