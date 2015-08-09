define(['functional/module','morris'], function (module) {
  'use strict';


      /*var bar_data= [{
          x : 'Test Suite 1',
          P : 100,
          F : 10,
          S : 10
      }, {
          x : 'Test Suite 2',
          P : 100,
          F : 0,
          S : 0
      }, {
          x : 'Test Suite 3',
          P : 90,
          F : 10,
          S : 0
      }, {
          x : 'Test Suite 4',
          P : 90,
          F : 0,
          S : 10
      }]*/

    /*module.registerDirective('morrisStackedBarGraph', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
              dataReports: '='
            },
            template: 'app/keyword/views/report.tpl.html',
            link: function(scope, element){
                Morris.Bar({
                    element : element,
                    axes : true,
                    grid : true,
                    data : bar_data,
                    xkey : 'x',
                    ykeys : ['P', 'F', 'S'],
                    labels : ['Pass', 'Fail', 'Skip'],
                    barColors : ['#15ab9f','#ff4f51','#fbd601'],
                    stacked : true
                });

            }
        }
  });*/

  module.registerController('OverviewCtrl', 
    ['$scope', '$state', '$stateParams', 'KeywordService',
    function($scope, $state, $stateParams, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS';
      /*$scope.dataReports = 
      [{
          x : 'Test Suite 1',
          P : 100,
          F : 10,
          S : 10
      }]*/

      $scope.suiteReports = [
        {
            "total_test_case" : 3,
            "total_pass" : 3,
            "total_fail" : 0,
            "total_skip" : 0,
            "test_result" : true,
            "name" : "Surefire suite",
            "running_time" :"2015-08-06T07:00:52.000Z"
        }
      ];
      
      KeywordService.getReport($scope.projectId,function(data,status) {
        var dataReports = 
          [{
              x : 'Test Suite 1',
              P : 100,
              F : 10,
              S : 10
          }];
        for(var i = 0; i < data.length; i++) {
          var obj;
          var nameSuite;
          var suiteReport = data[i].suite_reports;
          console.log(suiteReport);
          _.forEach(suiteReport,function(n,key) {
              obj = n;
              nameSuite = key;
          })

          var dataReport = {
            x : nameSuite,
            P : obj.total_pass,
            F : obj.total_fail,
            S : obj.total_skip
          }
          if(obj.test_result) {
            obj.test_result = 'Pass'
          } else {
            obj.test_result = 'False'
          }

          obj.running_time = obj.running_time.$date;
          $scope.suiteReports.push(obj);
          dataReports.push(dataReport);
          viewReport(dataReports);
        }
      });

      var viewReport = function(dataReports) {
        var eleReport = $(".reportElement");
        Morris.Bar({
                    element : eleReport,
                    axes : true,
                    grid : true,
                    data : dataReports,
                    xkey : 'x',
                    ykeys : ['P', 'F', 'S'],
                    labels : ['Pass', 'Fail', 'Skip'],
                    barColors : ['#15ab9f','#ff4f51','#fbd601'],
                    stacked : true
        });
      }

  }]);
});