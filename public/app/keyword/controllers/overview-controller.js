define(['functional/module','morris'], function (module) {
  'use strict';

  module.registerController('OverviewCtrl', 
    ['$scope', '$state', '$stateParams', 'KeywordService',
    function($scope, $state, $stateParams, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.jobId = $stateParams.jobId;

      $scope.title = 'OVERVIEWS';

      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
      });

      $scope.suiteReports = [];

      $scope.dataReports = [];

      if($scope.jobId) {
        
        KeywordService.getReport($scope.projectId, $scope.jobId, function(data,status) {
          getDataReport(data);
        });
      }
      
      var getDataReport = function(data) {

        for(var i = 0; i < data.length; i++) {
          var obj;
          var nameSuite;
          var suiteReport = data[i].suite_reports;

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
            obj.test_result = 'Fail'
          }

          obj.running_time = obj.running_time.$date;

          $scope.suiteReports.push(obj);
          $scope.dataReports.push(dataReport);

          draw($scope.dataReports);
        }
      }

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
                    barColors : ['#15ab9f','#ff4f51','#fbd601'],
                    stacked : true
        });
      }

  }]);
});