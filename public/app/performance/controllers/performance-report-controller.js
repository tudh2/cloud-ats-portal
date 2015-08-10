define(['performance/module', 'morris'], function (module) {

	'use strict';

	module.registerController('PerformanceReportCtrl',['$scope','$state', '$stateParams', 'ReportService', function ($scope, $state, $stateParams, ReportService) {

    var projectId = $stateParams.id;
    var jobId = $stateParams.jobId;
    
    ReportService.report(projectId, jobId, function (data, status) {
      $scope.reports = data;
    });

    $scope.backToOverviewPage = function () {
      $state.go('app.performance', {id : $stateParams.id});
    }
	}]);
});