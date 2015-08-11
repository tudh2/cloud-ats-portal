define(['projects/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ProjectsCtrl', [

    '$scope', '$state', '$stateParams', '$templateRequest', '$compile','KeywordService', 'PerformanceService', 'ReportService', 
    function($scope, $state, $stateParams, $templateRequest, $compile, KeywordService, PerformanceService, ReportService) {

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

    $scope.togglePerformance = function(event) {
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

    var loadModal = function() {
      var $modal = $('#project-log');

      //clear modal content
      $modal.html('');

      $templateRequest('app/projects/views/log-modal-content.tpl.html').then(function(template) {
        $modal.html($compile(template)($scope));
        $modal.modal('show');
      });
    };

    $scope.openLastLog = function (log) {
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });
      $scope.log = log;
      loadModal();
    }

    $scope.openLastReport = function(project) {
      switch (project.type) {
        case 'keyword':
          $state.go('app.keyword.report', {id: project._id, jobId: project.job_id });
          break;
        case 'performance':
          break;
        default:
      }
    }

    $scope.runLastest = function (project) {
      switch (project.type) {
        case 'keyword':
          runLastSuites(project);
          break;
        case 'performance':
          break;
        default:
      }
    }

    var runLastSuites = function(project) {
      var selected = [];
      _.forEach(project.lastSuites, function(sel) {
        selected.push(sel._id);
      });

      KeywordService.run(project._id, selected, function (data, status) {
        switch (status) {
          case 201:
            $.smallBox({
              title: 'Notification',
              content: 'You have submitted project job',
              color: '#296191',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            break;
          case 204:
            $.smallBox({
              title: 'Notification',
              content: 'Your project has been already running',
              color: '#296191',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            break;
          default:
            $.smallBox({
              title: 'Notification',
              content: 'Can not submmit your project job',
              color: '#c26565',
              iconSmall: 'fa fa-ban bounce animated',
              timeout: 3000
            });

        }
      });
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