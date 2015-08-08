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
      PerformanceService.run($stateParams.id, selected, function(data, status) {
        if (status == 200) {
          $.smallBox({
            title: "The test is running",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#296191",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });
        }
      });
    }

  }]);
});