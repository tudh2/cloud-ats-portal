define(['performance/module'], function (module) {
	'use strict';

	module.registerDirective('performanceReport', ['$state', function ($state) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				reports : '='
			},
			templateUrl: 'app/performance/directives/performance-report.tpl.html',
			link: function($scope, element, attributes) {

				$scope.openReportEachSampler = function (report, indexNumber) {
		      $state.go('app.performance.report.sampler', {reportId : report._id, index: indexNumber});
		    }

				var tmpArrayReports= [];    
    		var hits_per_second = [];
    		var trans_per_second = [];

				   // round information
	      _.forEach($scope.reports, function (report) {

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
	      var colorsSample = ["#008571","#ffce32","#af6ee8","#7cc7ff","#15ac9f","#ffaa2a","#3a5ea4","#2dacd1","#3bc1ac","#fd6d42","#4178be","#a4aeb6","#b4e051","#db2780","#5596e6","#8996a0","#9cbe3e","#9855d4","#5aaafa","#3a4a58"];
      
	      for(var i =0; i < maxLength; i++){
	        var tmpObj = {};      
	             
	        tmpObj.y = i;
	        for(var j =0 ; j < counterSample ; j ++){
	          var key = reportLabel[j];
	          if(size.length < counterSample ){   
	            size.push(key);         
	          }                    
	          
	          if(colors.length < counterSample ){   
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