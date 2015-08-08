define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$stateParams', '$state', 'PerformanceService', 
    function($scope, $stateParams, $state, PerformanceService) {

    	$scope.projectId = $stateParams.id;
      $scope.title = 'OVERVIEWS'
      PerformanceService.get($scope.projectId, function(response) {
        $scope.project = response;

        var jobs = JSON.parse(response.jobs);
        $scope.project.jobs = jobs;
        console.log($scope.project);
      });
      $scope.openJobReport = function (jobId, scriptId) {

        var obj = {projectId: $scope.projectId, jobId: jobId, scriptId: scriptId };
        $state.go('app.report.performance', obj);
      }
  	}]);
});