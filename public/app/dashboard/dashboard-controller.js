define(['dashboard/module', 'lodash','morris'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['$scope','$state','KeywordService','PerformanceService', 'DashboardService','ReportService','ScriptService', 
    function($scope,$state,KeywordService,PerformanceService, DashboardService,ReportService,ScriptService) {

      $scope.recent_finished_projects = [];
      $scope.performance_projects = [];
      $scope.recent_projects = [];

      DashboardService.summary(function (data, status) {

        // recent finished projects
        $scope.recent_finished_projects = JSON.parse(data.recentProjects);

        // get top project passed
        var top_keyword_projects_pass = JSON.parse(data.topKeywordPass);
        _.forEach(top_keyword_projects_pass, function (project) {
          project.percentPass = _.round(project.percentPass, 2);
          project.percentFail = _.round(project.percentFail, 2);
        });
        $scope.top_keyword_projects_pass = top_keyword_projects_pass;

        // get top project failed
        var top_keyword_projects_fail = JSON.parse(data.topKeywordFail);
        _.forEach(top_keyword_projects_fail, function (project) {
          project.percentPass = _.round(project.percentPass, 2);
          project.percentFail = _.round(project.percentFail, 2);
        });
        $scope.top_keyword_projects_fail = top_keyword_projects_fail;

        // get top biggest project
        var top_biggest_project = JSON.parse(data.topBiggestProject);
        $scope.top_biggest_project = top_biggest_project;

        // top error performance project
        var performance_projects = JSON.parse(data.persProjects);
        _.forEach(performance_projects, function (project) {
          project.error_percent = _.round(project.error_percent, 2);
        });
        $scope.performance_projects = performance_projects;

      });

      $scope.redirectPerformance = function (projectId) {
        $state.go('app.performance', {id: projectId});
      }

      $scope.redirectKeyword = function (projectId) {
        $state.go('app.keyword', { id : projectId });
      }

    }
  ]);
});