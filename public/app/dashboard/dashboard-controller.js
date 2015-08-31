define(['dashboard/module', 'lodash','morris'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['$scope','$state','KeywordService','PerformanceService','ReportService','ScriptService', 
    function($scope,$state,KeywordService,PerformanceService,ReportService,ScriptService) {

    $scope.recent_finished_projects = [];
    $scope.top_passed_projects = [];
    $scope.top_failed_projects = [];
    $scope.biggest_projects = [];
    $scope.performance_projects = [];

  var topProjects = function(topProject) { 
    
    if(topProject.length > 5) {
      var temp = topProject;
      var size = temp.length - 5;
      topProject.splice(5,size);
    }
    return topProject;
  }

  var getInfoProjects = function(data) {
    var topPass = [];
    var topFail = [];
    var topBigProject = [];
    var topProject = [];

    for(var i = 0; i < data.length; i ++) {
      var item = data[i];
      var totalCases = item.P+item.S+item.F;
      var percentPass = _.round((item.P/totalCases)*100,2);
      var percentFail = _.round((item.F/totalCases)*100,2);

      var infoProject = {
        _id : data[i]._id,
        name : data[i].x,
        percentPass : percentPass,
        percentFail : percentFail,
        totalCases : totalCases
      };

      topProject.push(infoProject);

      topBigProject.push(infoProject);
      topPass.push(infoProject);
      topFail.push(infoProject);

    }

    $scope.top_projects = topProjects(topProject);

    $scope.top_passed_projects = topProjects(topPass);
    $scope.top_failed_projects = topProjects(topFail);
    $scope.biggest_projects = topProjects(topBigProject);
  }

  var loadDataReport = function(data,projectName,numberOfJobId,projectId) {
      var totalPass = 0;
      var totalFail = 0;
      var totalSkip = 0;
      var totalCases = 0;
      var dataObject = JSON.parse(data.suite_reports);
      for(var i = 0; i < dataObject.length; i++) {
        var item = dataObject[i];
        totalPass += item.total_pass;
        totalFail += item.total_fail;
        totalSkip += item.total_skip;
      }
      var projectReport = {
        x : projectName,
        P : totalPass,
        F : totalFail,
        S : totalSkip,
        _id : projectId
      };

      $scope.recent_finished_projects.push(projectReport);

      if($scope.recent_finished_projects.length == numberOfJobId) {
        getInfoProjects($scope.recent_finished_projects);

        if($scope.recent_finished_projects.length > 10) {
          var temp = $scope.recent_finished_projects;
          var size = temp.length - 10;
          $scope.recent_finished_projects.splice(10,size);
        }
      }
  }

  var loadData = function() {
      var listProjects = [];
      var projectInfo = {};

      KeywordService.list(function (data,status) {
        listProjects = data;
        var countJobId = 0;
        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId === undefined) {
            countJobId ++;
          }
        })

        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          var numberOfJobId = listProjects.length - countJobId;
          if(lastJobId) {
            var projectId = item._id;
            var projectName = item.name;

            KeywordService.getReport(projectId,lastJobId,function (dataReport,statusReport) {
              loadDataReport(dataReport,projectName,numberOfJobId,projectId);
            });
          }
        })

      });

      //Load data for Performance project
      PerformanceService.projects(function (data) {
        var countJobId = 0;
        listProjects = [];
        listProjects = data;

        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId === undefined) {
            countJobId ++;
          }
        })

        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId) {
            var projectId = item._id;
            var projectName = item.name;
            var scriptsId = item.lastScripts;
            var scripts = [];
            var users = 0;
            var ram_up = 0;
            var loops = 0;
            var duration = 0;
            var performanceProjects = [];
            var perf_projectInfo = {};
            var count = 0;

            _.forEach(scriptsId, function (scriptId) {
              ScriptService.get(projectId,scriptId._id,function (data,status) {
                count ++;
                users += data.number_threads;
                ram_up += data.ram_up;
                loops += data.loops;
                duration += data.duration;
                if(count === scriptsId.length) {
                  ReportService.report(projectId,lastJobId,function (data,status) {
                    $scope.reports = data;

                    _.forEach($scope.reports, function (reports) {
                      
                      _.forEach(reports, function (report) {
                        report.summary.throughtput = _.round(report.summary.throughtput, 2);
                        report.summary.kb_per_second = _.round(report.summary.kb_per_second, 2);
                        report.summary.average = _.round(report.summary.average, 2);
                        report.summary.standard_deviation = _.round(report.summary.standard_deviation, 2);
                        report.summary.average_bytes = _.round(report.summary.average_bytes, 2);
                        report.summary.error_percent = _.round(report.summary.error_percent,2);
                      });

                      // get data of summary report
                    $scope.summaryReport = _.find(reports, function (report) {
                      return report.label == "*SummaryReport*";
                    });

                    perf_projectInfo = {
                      _id : projectId,
                      projectName : projectName,
                      users : users,
                      ram_up : ram_up,
                      loops : loops,
                      duration : duration,
                      samples : $scope.summaryReport.summary.samples,
                      error_percent : $scope.summaryReport.summary.error_percent
                    };

                    if(perf_projectInfo.error_percent != 0 ) {
                      $scope.performance_projects.push(perf_projectInfo);
                    }

                    });
                  });
                }
              });
            })

          }
        })
      });
    }

    loadData();

    $scope.redirectPerformance = function (projectId) {
      $state.go('app.performance', {id: projectId});
    }

    $scope.redirectKeyword = function (projectId) {
      $state.go('app.keyword', { id : projectId });
    }

    }
  ]);
});