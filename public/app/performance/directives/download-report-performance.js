define(['performance/module'], function (module) {
	'use strict';

	module.registerDirective('downloadReportPerformance',['$rootScope','PerformanceService', function ($rootScope,PerformanceService) {
		return {
			restrict : 'A',
			replace : true,
			scope:{
				jobId: '=',
				projectId:'='
			},
			link : function (scope,element,attrs) {

				scope.$watch('jobId', function(newValue) {
					if(newValue){
	                    PerformanceService.download(scope.projectId, newValue ,function (data,status) {
				          var file = new Blob([data], {type: 'application/jtl'});
				          var url = (window.URL || window.webkitURL).createObjectURL(file);
				          element.attr('href', url);
				        });
	                }
				});
			}
		}
	}]);
});