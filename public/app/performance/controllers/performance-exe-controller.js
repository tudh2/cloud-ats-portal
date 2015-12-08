define(['performance/module', 'lodash', 'morris', 'notification'], function (module, _) {
  
  'use strict';
   
  module.registerController('PerformanceExeCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$compile', '$templateRequest', 'ScriptService', 'PerformanceService', function($scope, $rootScope, $state, $stateParams, $compile, $templateRequest, ScriptService, PerformanceService) {
   
    $scope.searchTerms = '';

    $scope.samplerReport = true; 
 		$scope.projectId = $stateParams.id;

    $scope.number_engines = 0;

    var engines = [];
    var selected = [];
 		$scope.title = "EXECUTION";

    ScriptService.list($scope.projectId, function(response) {

      _.forEach(response, function (script) {
        script.showInfo = false;        
      });
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
            title: $rootScope.getWord("Project Execution Alert!"),
            content: $rootScope.getWord("Your project has been already running. Please back to overivew tab to track project progress"),
            buttons: $rootScope.getWord('[Go to overview]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Go to overview" || ButtonPressed === "概要に戻ります") {
              $state.go('app.performance', {id: $scope.projectId});
            }
          });
          return false;
        }

        return true;
    }
    
    // handle when user selects scripts
    $scope.selectScript = function (script) {

      script.showInfo = !script.showInfo;
      $scope.number_engines = 0;
      var $btnRun = $('.btn.btn-primary.btn-performance-run');
      if (_.indexOf(selected, script._id) != -1) {
          _.remove(selected, function(sel) {
            return sel == script._id;
          });
        } else {
          selected.push(script._id);
        }

      if (selected.length > 0) $btnRun.removeClass('disabled');
      else $btnRun.addClass('disabled');
      
      _.forEach(selected, function (scriptId) {
        _.forEach($scope.scripts, function (script) {
          if (scriptId == script._id) {
            if (script.number_engines > $scope.number_engines) {
              $scope.number_engines = script.number_engines;
            }
          }
        });
      });
    }

    //run project with projectid and list scripts
    $scope.runPerformanceTest = function () {

      if (checkProjectStatus())
      PerformanceService.run($stateParams.id, selected, function(data, status) {
        switch (status) {
          case 200:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been already running'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not submit your project job'),
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