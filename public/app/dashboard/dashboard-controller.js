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

        // top projects
        var top_projects = JSON.parse(data.percentsProjects);
        _.forEach(top_projects, function (project) {
          project.percentPass = _.round(project.percentPass, 2);
          project.percentFail = _.round(project.percentFail, 2);
        });
        $scope.top_projects = top_projects;

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