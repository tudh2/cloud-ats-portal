define(['performance/module', 'morris'], function (module) {

	'use strict';

	module.registerController('PerformanceReportCtrl',['$scope','$state', '$stateParams', 'ReportService', function ($scope, $state, $stateParams, ReportService) {

    $scope.projectId = $stateParams.id;
    $scope.jobId = $stateParams.jobId;
    
    ReportService.report($scope.projectId, $scope.jobId, function (data, status) {
      $scope.reports = data;
    });

    $scope.backToOverviewPage = function () {
      $state.go('app.performance', {id : $scope.projectId});
    }
	}]);
});