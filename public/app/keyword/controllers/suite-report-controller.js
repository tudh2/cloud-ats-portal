define(['keyword/module', 'lodash', 'c3'], function (module, _, c3) {
  'use strict';

  module.registerController('SuiteReportCtrl', ['$scope', '$state', function ($scope, $state) {
    console.log("Report Suite");


    $scope.redirectToTestCaseReport = function() {
        $state.go('app.keyword.report.suite.testcase');
      }

    var chart = c3.generate({
      bindto: '#chart1',
      data: {
        columns: [
            ['Pass', 3, 20, 10, 40, 15, 25],
            ['Fail', 13, 10, 24, 20, 15, 50]
        ],
        type: 'spline',
        colors: {
            Pass: 'rgb(21, 171, 159)',
            Fail: 'rgb(255, 79, 81)',
        },
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