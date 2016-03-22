define(['keyword/module', 'lodash', 'c3'], function (module, _, c3) {
  'use strict';

  module.registerController('SuiteReportCtrl', ['$scope', '$state', '$stateParams', 'KeywordService', function ($scope, $state, $stateParams, KeywordService) {
    
    $scope.jobId = $stateParams.jobId;
    $scope.suiteId = $stateParams.suiteId;
    $scope.projectId = $stateParams.id;
    $scope.suiteReportId = $stateParams.suiteReportId;

    $scope.query = {
      'limit': 10,
      'current': 1,
      'total':0
    }

    KeywordService.suiteReports($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, 0, function (data, status) {
      
      $scope.case_reports = JSON.parse(data.reports);
      $scope.query.total = data.totalCase;
      $scope.suites = JSON.parse(data.suites);
      _.forEach($scope.case_reports, function (obj) {
        obj.report = JSON.parse(obj.report);
        console.log(obj.report);
        if (obj.data_driven) {
          obj.data_source = JSON.parse(obj.data_source);
        }
      });
      console.log($scope.case_reports);
    });

    $scope.redirectToTestCaseReport = function(id) {
      console.log(id);
      $state.go('app.keyword.report.suite.testcase', {'caseReportId': id});
    }

  }]);
});