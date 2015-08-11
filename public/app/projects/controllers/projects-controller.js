define(['projects/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ProjectsCtrl', [

    '$scope', '$state', '$stateParams','KeywordService', 'PerformanceService', 'ReportService', 
    function($scope, $state, $stateParams, KeywordService, PerformanceService, ReportService) {

    $scope.searchTerms = '';

    $scope.options = {
      ready: true,
      running: true,
      keyword: true,
      performance: true
    }

    $scope.toggleReady = function() {
      $scope.options.ready = $scope.options.ready === true ? false : true;
    }

    $scope.toggleRunning = function() {
      $scope.options.running = $scope.options.running === true ? false : true;
    }

    $scope.toggleKeyword = function(event) {
      var $element = $(event.currentTarget);
      $element.toggleClass('active');
      $scope.options.keyword = $scope.options.keyword === true ? false : true;
    }

    $scope.togglePerformance = function() {
      var $element = $(event.currentTarget);
      $element.toggleClass('active');
      $scope.options.performance = $scope.options.performance === true ? false : true;
    }

    $scope.projectFilter = function (project) {
      var projectStatus = {
        ready: project.status === 'READY',
        running: project.status === 'RUNNING',
        keyword : project.type === 'keyword',
        performance: project.type === 'performance'
      }
      var result = ($scope.options.ready && projectStatus.ready 
              || $scope.options.running && projectStatus.running )
        && ($scope.options.keyword && projectStatus.keyword
                || $scope.options.performance && projectStatus.performance)

      return result;
    }

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

      $state.go('app.keyword.report', { id : projectId, jobId: jobId});
    }

    $scope.checkLastestRun = function(project) {
      $scope.jobId = project.job_id;
    }

    var loadPerformanceProjects = function() {
      PerformanceService.projects(function (response) {
        if ($scope.projects === undefined) $scope.projects = [];
        $scope.projects.push(response);
        $scope.projects = _.flatten($scope.projects, true);
      });
    };

    var loadKeywordProjects = function() {
      KeywordService.list(function (response) {
        if ($scope.projects === undefined) $scope.projects = [];
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