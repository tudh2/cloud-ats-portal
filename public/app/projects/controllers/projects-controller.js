define(['projects/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ProjectsCtrl', [
    '$scope', '$state', '$stateParams','KeywordService', 
    function($scope, $state, $stateParams, KeywordService) {
      
    $scope.projects = [
      
    ];

    $scope.openProject = function(projectId, projectType) {
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });
      switch (projectType) {
        case 'performance':
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

    var loadPerformanceProjects = function() {
      $scope.projects.push(
        {
          _id: "18",
          name: "Performance is Enterprise Database System. This test case is cover the front end area",
          status: "RUNNING",
          type: "performance",
        },
        {
          _id: "19",
          name: "Performance is Enterprise Database System. This test case is cover the front end area",
          status: "RUNNING",
          type: "performance",
        },
        {
          _id: "20",
          name: "Performance is Enterprise Database System. This test case is cover the front end area",
          status: "RUNNING",
          type: "performance",
        }
      )
    };

    var loadKeywordProjects = function() {
      KeywordService.projects(function (response) {
        console.log(response);
        $scope.projects.push(response);
        $scope.projects = _.flatten($scope.projects, true);
        console.log($scope.projects);
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