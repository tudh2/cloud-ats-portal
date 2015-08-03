define(['functional/module'], function (module) {
  'use strict';

  module.registerController('KeywordDetailCtrl', 
    ['$scope', '$state', '$stateParams','KeywordService', 'CaseService',
    function($scope, $state, $stateParams, KeywordService, CaseService) {

      var projectId = $stateParams.id;


      var overview = function() {
        $scope.title = 'OVERVIEWS';
        $('a[href="#overview"]').tab('show');

        KeywordService.get(projectId, function(response) {
          $scope.project = response;
        });
      };

      var cases = function() {
        $scope.title = 'TEST CASES';
        $('a[href="#cases"]').tab('show');

        CaseService.list(projectId, function(response) {
          $scope.cases = response;
          $scope.cases.push(
            {
              "name": "Test Case 1",
              "steps": [],
              "info":""
            }
          )
        });
      }

      switch($stateParams.tab) {

        case 'overview':
            overview();
            break;
          case 'cases':
            cases();
            break;
          case 'driven':
            $scope.title = 'DATA DRIVEN';
            $('a[href="#driven"]').tab('show');
            break;
          case 'suites':
            $scope.title = 'TEST SUITES';
            $('a[href="#suites"]').tab('show');
            break;
          case 'execution':
            $scope.title = 'EXECUTION';
            $('a[href="#execution"]').tab('show');
            break;
          default:
            break;
      };

      $scope.changeTab = function(tab) {
        switch(tab) {
          case 'overview':
            $scope.title = 'OVERVIEWS';
            $state.go('app.keyword', { id : projectId, tab: 'overview' });
            break;
          case 'cases':
            $scope.title = 'TEST CASE';
            $state.go('app.keyword', { id : projectId, tab: 'cases' });
            break;
          case 'driven':
            $scope.title = 'DATA DRIVEN';
            break;
          case 'suites':
            $scope.title = 'EXECUTION';
            break;
          case 'execution':
            break;
          default:
            break;
        }
      }
  }]);
});