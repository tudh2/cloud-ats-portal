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

    var getReport = function (index) {
      KeywordService.suiteReports($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, index, function (data, status) {
        $scope.case_reports = JSON.parse(data.reports);
        $scope.query.total = data.totalCase;

        _.forEach($scope.case_reports, function (obj) {
          obj.data_source = JSON.parse(obj.data_source);
        });
      });
    }

    KeywordService.lastestJobs($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, function (data, status) {
      $scope.suites = JSON.parse(data.suites);

      var numberOfPassedCase = data.numberOfPassedCase;
      var numberOfFailedCase = data.numberOfFailedCase;
      var chart = c3.generate({
        bindto: "#chart",
        data: {
          // iris data from R
          columns: [
              ['Pass', numberOfPassedCase],
              ['Fail', numberOfFailedCase],
          ],
          colors:{
            Pass : '#00b4a0',
            Fail : '#ff5050'
          },
          type: 'pie',
          onclick: function (d, i) {},
          onmouseover: function (d, i) {},
          onmouseout: function (d, i) {}
        }
      });
    });

    $scope.$watch('query.current', function (index) {
      getReport(index - 1);
    });

    $scope.redirectToTestCaseReport = function(id) {
      $state.go('app.keyword.report.suite.testcase', {'caseReportId': id});
    }

    $scope.goToJobReport = function (id) {
      $state.go('app.keyword.report', {'jobId' : id});
    }
  }]);
});