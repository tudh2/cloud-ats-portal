define(['keyword/module', 'lodash', 'c3'], function (module, _, c3) {
  'use strict';

  module.registerController('SuiteReportCtrl', ['$scope', '$state', function ($scope, $state) {
    
    $scope.caseReportId ="8d752305-7d8b-4c43-bf00-d4416717d7da";
    $scope.redirectToTestCaseReport = function() {
        $state.go('app.keyword.report.suite.testcase',{'caseReportId': $scope.caseReportId});
      }

    var chart = c3.generate({
      bindto: '#chart1',
      data: {
        x: 'Date',
        columns: [
            ['Date', '2012-12-31', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05'],
            ['Pass', 20, 10, 40, 15, 25],
            ['Fail', 10, 24, 20, 15, 50],
            ['Skip', 1, 4, 2, 5, 0]
        ],
        type: 'spline',
        colors: {
            Pass: 'rgb(21, 171, 159)',
            Fail: 'rgb(255, 79, 81)',
            Skip: '#ffaa2a',
        },
        },
         axis: {
        x: {
            type: 'timeseries',
            localtime: true,
            tick: {
                format: '%Y-%m-%d %H:%M:%S'
            }
        },
        y: {
            min: 5,
        }
    }

       });

    var chart = c3.generate({
      bindto: '#chart2',
       data: {
        // iris data from R
        columns: [
            ['Pass', 35],
            ['Fail', 120],
        ],
        type : 'pie',
        colors: {
            Pass: 'rgb(21, 171, 159)',
            Fail: 'rgb(255, 79, 81)',
        },
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          }
      });


  }]);
});