define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('KeywordReportCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies', 'KeywordService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.jobId = $stateParams.jobId;

      $scope.title = 'REPORTS';
      
      $scope.suiteReports = [];

      $scope.listSuiteReports = [];

      $scope.dataReports = [];

      var getDataReport = function(data) {
        var suiteReport = JSON.parse(data.suite_reports);

        _.forEach(suiteReport,function(obj,key) {
            var dataReport = {
              x : obj.name,
              P : obj.total_pass,
              F : obj.total_fail,
              S : obj.total_skip
            };
            $scope.dataReports.push(dataReport);
            if(obj.test_result) {
              obj.test_result = 'Pass'
            } else {
              obj.test_result = 'Fail'
            }

            $scope.suiteReports.push(obj);
        })
        $scope.listSuiteReports = $scope.dataReports;
      };

      KeywordService.getReport($scope.projectId, $scope.jobId, function(data,status) {
          getDataReport(data);
      });

      $scope.redirectTo = function() {
        $state.go('app.keyword',{id: $scope.projectId});
      }

  }]);
});