define(['keyword/module'], function (module) {
	'use strict';

	module.registerDirective('downloadReportKeyword',['$rootScope','KeywordService', function ($rootScope,KeywordService) {
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
	                    KeywordService.download(scope.projectId, newValue ,function (data,status) {
				          var file = new Blob([data], {type: 'application/x-gzip'});
				          var url = (window.URL || window.webkitURL).createObjectURL(file);
				          element.attr('href', url);
				        });
	                }
				});
			}
		}
	}]);
});