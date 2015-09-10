define(['performance/module'], function (module) {
	'use strict';

	module.registerDirective('performanceReport', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				reports : '=',
				init: '&'
			},
			templateUrl: 'app/performance/directives/performance-report.tpl.html',
			link: function($scope, element, attributes) {

				$scope.openReportEachSampler = function (report, indexNumber) {
		      $state.go('app.performance.report.sampler', {reportId : report._id, index: indexNumber});
		    }

				var tmpArrayReports= [];    
    		var hits_per_second = [];
    		var trans_per_second = [];
    		
    		$timeout(function () {
    			$scope.getWord = $rootScope.getWord;
    		}, 1000);
				   // round information
	      _.forEach($scope.reports, function (report) {

	      	report.summary.error_percent = _.round(report.summary.error_percent, 2);
	        report.summary.throughtput = _.round(report.summary.throughtput, 2);
	        report.summary.kb_per_second = _.round(report.summary.kb_per_second, 2);
	        report.summary.average = _.round(report.summary.average, 2);
	        report.summary.standard_deviation = _.round(report.summary.standard_deviation, 2);
	        report.summary.average_bytes = _.round(report.summary.average_bytes, 2);
	      });
	      // get data of summary report
	      $scope.summaryReport = _.find($scope.reports, function (report) {
	        return report.label == "*SummaryReport*";
	      });
	      // get data of all samplers
	      _.remove($scope.reports, function (report) {
	        return report.label == $scope.summaryReport.label;
	      });

	      // start to create array to draw hits per second chart
	      var maxLength = 0;
	      var counterSample = 0;
	      var reportLabel = [];  

	      _.forEach($scope.reports, function (report) {
	        var tmpArray = [];
	        _.forIn(report.hits_per_second, function (data) {
	          tmpArray.push(data);
	        });
	        counterSample ++;  
	        reportLabel.push(report.label);
	        tmpArrayReports.push(tmpArray);
	        if(tmpArray.length > maxLength){
	          maxLength = tmpArray.length;
	        }
	      });     
      
	      // size of array and random color for each sampler
	      var size = []; 
	      var colors = [];
	      var colorsSample = ["#00B4A1","#ffaa2a","#ff5050","#ff7832","#9cbe3e","#ffce32","#9855d4","#af6ee8","#3a5ea4","#4178be","#5596e6","#7cc7ff","#7cc7ff","#2dacd1","008571","#a4aeb6","#8996a0","#3a4a58","#9cbe3e","#9855d4","#5aaafa","#3a4a58"];
	      for(var i =0; i < maxLength; i++){
	        var tmpObj = {};      
	             
	        tmpObj.y = i;
	        for(var j =0 ; j < counterSample ; j ++){
	          var key = reportLabel[j];
	          if(size.length < counterSample ){   
	            size.push(key);         
	          }                    
	          
	          if(colors.length < counterSample){   
	            colors.push(colorsSample[j]);    

	          } 

	          if(tmpArrayReports[j][i] != null){
	            tmpObj[key] = tmpArrayReports[j][i].value;
	          }
	         
	        }                
	        hits_per_second.push(tmpObj);

	      }
	      // fill data to chart using morris libray
	      var $hits_per_second = $(element).find('.hit-per-second');
	      Morris.Line({
	        element : $hits_per_second,
	        data : hits_per_second,
	        xkey : 'y',
	        ykeys : size,
	        labels : reportLabel,
	        lineColors : colors,
	        parseTime : false,
	        lineWidth: 1,
	        pointSize: 2
	      });

	      // start to draw transactions per second chart
	      size = [];
	      //colors = [];
	      counterSample = 0;
	      maxLength = 0;
	      reportLabel = []; 
	      var $trans_per_second = $(element).find('.tran-per-second');
	      tmpArrayReports = [];

	      _.forEach($scope.reports, function (report) {
	        var tmpArray = [];
	        _.forIn(report.trans_per_second, function (data) {
	          tmpArray.push(data);
	        });
	        counterSample ++;   
	        reportLabel.push(report.label); 
	        tmpArrayReports.push(tmpArray);
	        if(tmpArray.length > maxLength){
	          maxLength = tmpArray.length;
	        }
	      });     
	      
	      for(var i =0; i < maxLength; i++){
	        var tmpObj = {};      
	             
	        tmpObj.y = i;
	        for(var j =0 ; j < counterSample ; j ++){
	          var key = reportLabel[j];
	          if(size.length < counterSample ){   
	            size.push(key);         
	          }          

	          if(tmpArrayReports[j][i] != null){
	            tmpObj[key] = tmpArrayReports[j][i].value;
	          }
	         
	        }                
	        trans_per_second.push(tmpObj);

	      }
    
	      // fill data to chart
	      Morris.Line({
	        element : $trans_per_second,
	        data : trans_per_second,
	        xkey : 'y',
	        ykeys : size,
	        labels : reportLabel,
	        lineColors : colors,
	        parseTime : false,
	        lineWidth: 1,
	        pointSize: 2
	      });

	      var colors_labels = [];
	      var colorObject = _.zipObject(reportLabel, colors);

	      _.forIn(colorObject, function (value, key) {
	        var obj = {};
	        obj.color = value;
	        obj.label = key;
	        colors_labels.push(obj);
	      });

      	$scope.colors = colors_labels;

			}
		}
	}]);
})