define(['performance/module', 'morris'], function (module) {

	'use strict';

	module.registerController('PerformanceReportCtrl',['$scope','$state', '$stateParams', 'ReportService', function ($scope, $state, $stateParams, ReportService) {

    var projectId = $stateParams.projectId;
    var jobId = $stateParams.jobId;
    var scriptId = $stateParams.scriptId;
    $scope.reports = [];
    var tmpArrayReports= [];    
    var hits_per_second = [];
    
    
    var trans_per_second = [];
    ReportService.report(projectId, jobId, scriptId ,function (data, status) {
      $scope.reports = data;
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
      for(var i =0; i < maxLength; i++){
        var tmpObj = {};      
             
        tmpObj.y = i;
        for(var j =0 ; j < counterSample ; j ++){
          var key = reportLabel[j];
          if(size.length < counterSample ){   
            size.push(key);         
          }          
          var color = "rgb(" + _.random(0,255) + "," + _.random(0,255) + "," + _.random(0,255) +")";
          
          if(colors.length < counterSample ){   
            colors.push(color);         
          }

          if(tmpArrayReports[j][i] != null){
            tmpObj[key] = tmpArrayReports[j][i].value;
          }
         
        }                
        hits_per_second.push(tmpObj);

      }
      // fill data to chart using morris libray
      var $hits_per_second = $('.hit-per-second');
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
      var $trans_per_second = $('.tran-per-second');
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
        labels : size,
        lineColors : colors,
        parseTime : false,
        lineWidth: 1,
        pointSize: 2
      });
    });
    $scope.openReportEachSampler = function (report, indexNumber) {
      $state.go('app.report.performance.sampler', {reportId : report._id});
    }

	}]);
});