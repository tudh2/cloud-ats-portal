define(['projects/module'], function (module) {

  'use strict';

  module.registerController('ProjectsCtrl', ['$scope', 'KeywordService', function($scope, keywordService) {
    console.log('hrererere');

    keywordService.getListFunctionalProject(function (response) {
      $scope.functionalPros = response;

      _.forEach($scope.functionalPros, function (project) {
        _.forEach(project.suites, function (suite) {
          suite.cases = JSON.parse(suite.cases);
        });
      });
    });

  }]);

});