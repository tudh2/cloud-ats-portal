define(['dashboard/module', 'lodash','morris'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['$scope','$state','KeywordService','KeywordUploadService','PerformanceService','ReportService','ScriptService', 
    function($scope,$state,KeywordService,KeywordUploadService,PerformanceService,ReportService,ScriptService) {

    $scope.recent_finished_projects = [];
    $scope.performance_projects = [];
    $scope.recent_projects = [];

  var getInfoProjects = function(data) {
    var topProject = [];

    _.forEach(data, function (item) {
      var totalCases = item.P+item.S+item.F;
      var percentPass = _.round((item.P/totalCases)*100,2);
      var percentFail = _.round((item.F/totalCases)*100,2);
      var infoProject = {
        _id : item._id,
        name : item.x,
        percentPass : percentPass,
        percentFail : percentFail,
        totalCases : totalCases,
        upload_project : item.upload_project
      };

      topProject.push(infoProject);
    })
    
    $scope.top_projects = topProject;
  }

  var loadDataReport = function(data,numberOfJobId) {
      var totalPass = 0;
      var totalFail = 0;
      var totalSkip = 0;
      var totalCases = 0;
      var projectName = data.projectName;
      var projectId = data.projectId;
      var upload_project = data.upload_project;
      var dataObject = JSON.parse(data.suite_reports);
      _.forEach(dataObject, function (obj) {
        totalPass += obj.total_pass;
        totalFail += obj.total_fail;
        totalSkip += obj.total_skip;
      });

      var projectReport = {
        x : projectName,
        P : totalPass,
        F : totalFail,
        S : totalSkip,
        _id : projectId,
        upload_project:upload_project
      };

      $scope.recent_projects.push(projectReport);
      if($scope.recent_projects.length == numberOfJobId) {
        $scope.recent_finished_projects = $scope.recent_projects;
        getInfoProjects($scope.recent_finished_projects);

        if($scope.recent_finished_projects.length > 10) {
          var temp = $scope.recent_finished_projects;
          var size = temp.length - 10;
          $scope.recent_finished_projects.splice(0,size);
        }
      }
  }

  var sortJSON = function(data, key) {
      return data.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  }

  var loadData = function() {
      var listProjects = [];
      var projectInfo = {};
      var listReports = [];
	  KeywordService.list(function (data,status) {

	  	KeywordUploadService.list(function (dataUpload,statusUpload) {
	  		listProjects = data;
	  		listProjects.push(dataUpload);
	  		listProjects = _.flatten(listProjects, true);
	  		var countJobId = 0;

	  		_.forEach(listProjects, function (item,key) {
	          var lastJobIdAll = item.lastJobId;
	          if(lastJobIdAll) {
	            countJobId ++;
	          }
	        });

	        //Load data report for keyword project
	        _.forEach(data, function (item,key) {
	          var lastJobId = item.lastJobId;
	          if(lastJobId) {
	            var projectId = item._id;
	            var projectName = item.name;

	            KeywordService.getReport(projectId,lastJobId,function (dataReport,statusReport) {
	              if(dataReport === null) {
	              	countJobId = countJobId - 1;
	              } else {
	              	if(item.lastJobId == dataReport.functional_job_id) {
		                dataReport.projectName = projectName;
		                dataReport.projectId = projectId;
		                listReports.push(dataReport);
		              }
		              //sort list report
		              if(countJobId == listReports.length) {
		                var sortListReports = sortJSON(listReports, 'created_date');
		                _.forEach(sortListReports, function (report) {
		                  loadDataReport(report,countJobId);
		                })
		              }
	              }

	            });
	          }
	        });
			
			//Load data report for keyword upload project
			_.forEach(dataUpload, function (item,key) {
	          var lastJobId = item.lastJobId;
	          if(lastJobId) {
	            var projectId = item._id;
	            var projectName = item.name;
	            KeywordUploadService.getReport(projectId,lastJobId,function (dataReport,statusReport) {
	              if(dataReport.functional_job_id === undefined) {
	              	countJobId = countJobId - 1;
	              }

	              if(dataReport.functional_job_id) {
	              	if(item.lastJobId == dataReport.functional_job_id) {
	                dataReport.projectName = projectName;
	                dataReport.projectId = projectId;
	                dataReport.upload_project = item.upload_project;
	                listReports.push(dataReport);
	              }
	              //sort list report
	              if(countJobId == listReports.length) {
	                var sortListReports = sortJSON(listReports, 'created_date');
	                _.forEach(sortListReports, function (report) {
	                  loadDataReport(report,countJobId);
	                })
	              }
	              }
	            });
	          }
	        });
			
	  	});
	  });

      //Load data for Performance project
      PerformanceService.projects(function (data) {
        var countJobId = 0;
        //listProjects is emptied
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

    $scope.redirectKeyword = function (projectId,upload_project) {
    	if(upload_project) {
    		$state.go('app.keyword-upload', { id : projectId });
    	} else {
    		$state.go('app.keyword', { id : projectId });
    	}
    }

    }
  ]);
});