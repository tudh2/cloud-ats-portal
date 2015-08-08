define(['performance/module', 'morris'], function (module) {

	'use strict';

	module.registerController('PerformanceReportDetailCtrl',['$scope', '$stateParams', 'ReportService', function ($scope, $stateParams, ReportService) {

		var reportId = $stateParams.reportId;
		ReportService.get(reportId, function (report, status) {

			var tmpHitsArray = [];
      var i =0
      _.forIn(report.hits_per_second, function (data) {
        var tmpObj = data;        
        tmpObj.timestamp = i;        
        tmpHitsArray.push(tmpObj);
        i ++;
      });

      var $hits_per_second = $('.sampler-report');
      Morris.Line({
        element : $hits_per_second,
        data : tmpHitsArray,
        xkey : 'timestamp',
        ykeys : ['value'],
        labels : ['value'],
        lineColors: ['#FF0000'],
        parseTime : false,
        lineWidth: 1,
        pointSize: 2
      });
		});
	}]);
});