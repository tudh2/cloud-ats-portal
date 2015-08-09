define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$stateParams', '$state', 'PerformanceService', 
    function($scope, $stateParams, $state, PerformanceService) {

    	$scope.projectId = $stateParams.id;
      $scope.title = 'OVERVIEWS'
      PerformanceService.get($scope.projectId, function(response) {
        $scope.project = response;

        if (response.jobs != null) {
          var jobs = JSON.parse(response.jobs);
          $scope.project.jobs = jobs;
        }
      });

      $scope.openJobReport = function (jobId) {
        $state.go('app.performance.report', {jobId : jobId});
      }
      
  	}]);
});