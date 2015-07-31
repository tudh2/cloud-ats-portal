define(['projects/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ProjectsCtrl', [
    '$scope', '$stateParams','KeywordService', 
    function($scope, $stateParams, KeywordService) {
      
    $scope.projects = [
      
    ];

    var loadPerformanceProjects = function() {
      $scope.projects.push(
        {
          projectId: "18",
          projectName: "Performance is Enterprise Database System. This test case is cover the front end area",
          status: "RUNNING",
          type: "performance",
        }
      )
    };

    var loadKeywordProjects = function() {
      KeywordService.getListFunctionalProject(function (response) {
        var keywordProjects = response;

        _.forEach(keywordProjects, function (project) {
          project.type = "keyword";
          project.status = "READY";
          _.forEach(project.suites, function (suite) {
            suite.cases = JSON.parse(suite.cases);
          });
        });

        $scope.projects.push(keywordProjects);
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