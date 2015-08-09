define(['projects/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ProjectsCtrl', [

    '$scope', '$state', '$stateParams','KeywordService', 'PerformanceService', 'ReportService', 
    function($scope, $state, $stateParams, KeywordService, PerformanceService, ReportService) {
    
    $scope.projects = [
      
    ];

    $scope.openProject = function(projectId, projectType) {
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });

      switch (projectType) {
        case 'performance':
          $state.go('app.performance', {id: projectId});
          break;
        case 'keyword':
          $state.go('app.keyword', { id : projectId });
          break;
        case 'functional':
          $state.go('app.functional', { id : projectId });
          break;
        default:
          break;
      }
    }

    $scope.reports = function(projectId,projectType,jobId) {
  
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });
      console.log($scope);
      switch (projectType) {
        case 'performance':
          $state.go('app.performance', {id: projectId});
          break;
        case 'keyword':
          $state.go('app.keyword.report', { id : projectId, jobId: jobId});
          break;
        default:
          break;
      }
    }

    $scope.checkLastestRun = function(project) {
      $scope.jobId = project.job_id;
    }

    var loadPerformanceProjects = function() {
      PerformanceService.projects(function (response) {
        $scope.projects.push(response);
        $scope.projects = _.flatten($scope.projects, true);
      });
    };

    var loadKeywordProjects = function() {
      KeywordService.list(function (response) {
        $scope.projects.push(response);
        $scope.projects = _.flatten($scope.projects, true);
      });
    };

    switch($stateParams.type) {
      case 'performance':
        loadPerformanceProjects();
        break;
      case 'keyword':
        loadKeywordProjects();
        break;
      default:
        loadPerformanceProjects();
        loadKeywordProjects();
    }
    
  }]);

});