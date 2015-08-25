define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('KeywordReportCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies', 'KeywordService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.jobId = $stateParams.jobId;

      $scope.title = 'REPORTS';
      
      $scope.suiteReports = [];

      $scope.dataReports = [];

      var getDataReport = function(data) {
        var obj;
        var nameSuite;
        var suiteReport = JSON.parse(data.suite_reports);

        _.forEach(suiteReport,function(n,key) {
            obj = n;
            nameSuite = key;
            var dataReport = {
              x : nameSuite,
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

        draw($scope.dataReports);
      };

      var draw = function(dataReports) {
        var eleReport = $(".functional-report");
        if($('div').find('.functional-report').length > 0)
        Morris.Bar({
                    element : eleReport,
                    axes : true,
                    grid : true,
                    data : dataReports,
                    xkey : 'x',
                    ykeys : ['P', 'F', 'S'],
                    labels : ['Pass', 'Fail', 'Skip'],
                    barColors : ['#00B4A1','#ff5050','#ffaa2a'],
                    stacked : true
        });
      };

      KeywordService.getReport($scope.projectId, $scope.jobId, function(data,status) {
          getDataReport(data);
      });

      $scope.redirectTo = function() {
        $state.go('app.keyword',{id: $scope.projectId});
      }


  }]);
});