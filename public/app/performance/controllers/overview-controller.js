define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$stateParams', '$state', 'PerformanceService', 
    function($scope, $stateParams, $state, PerformanceService) {

    	$scope.projectId = $stateParams.id;
      $scope.title = 'OVERVIEWS'
      PerformanceService.get($scope.projectId, function(response) {
        $scope.project = response;

        var scripts = JSON.parse($scope.project.scripts);
        $scope.project.scripts = scripts;
      });

  	}]);
});