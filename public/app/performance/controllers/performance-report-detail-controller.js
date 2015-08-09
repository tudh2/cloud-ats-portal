define(['performance/module', 'morris'], function (module) {

	'use strict';

	module.registerController('PerformanceReportDetailCtrl',['$scope', '$state', '$stateParams', 'ReportService', function ($scope, $state, $stateParams, ReportService) {

		var reportId = $stateParams.reportId;
		ReportService.get(reportId, function (report, status) {

      report.summary.throughtput = _.round(report.summary.throughtput, 2);
      report.summary.kb_per_second = _.round(report.summary.kb_per_second, 2);
      report.summary.average = _.round(report.summary.average, 2);
      report.summary.standard_deviation = _.round(report.summary.standard_deviation, 2);
      report.summary.average_bytes = _.round(report.summary.average_bytes, 2);

      $scope.report = report;
			var tmpHitsArray = [];
      var i =0
      _.forIn(report.hits_per_second, function (data) {
        var tmpObj = data;        
        tmpObj.timestamp = i;        
        tmpHitsArray.push(tmpObj);
        i ++;
      });

      var $hits_per_second = $('.sampler-report-hits');
      Morris.Line({
        element : $hits_per_second,
        data : tmpHitsArray,
        xkey : 'timestamp',
        ykeys : ['value'],
        labels : ['value'],
        lineColors: ['#15ac9f'],
        parseTime : false,
        lineWidth: 2,
        pointSize: 3
      });

      var tmpTransArray = [];
      i = 0;

      _.forIn(report.trans_per_second, function (data) {
        var tmpObj = data;
        tmpObj.timestamp = i;
        tmpTransArray.push(tmpObj);
        i ++;

      });

      var $trans_per_second = $('.sampler-report-trans');
      Morris.Line({
        element : $trans_per_second,
        data : tmpTransArray,
        xkey : 'timestamp',
        ykeys : ['value'],
        labels : ['value'],
        lineColors: ['#9855d4'],
        parseTime : false,
        lineWidth: 2,
        pointSize: 3
      });

      console.log(tmpHitsArray);
      console.log(tmpTransArray);
		});

    $scope.backToOverviewReport = function () {
      $state.go('app.performance.report', {jobId : $stateParams.jobId});
    }

	}]);
});