define(['keyword/module'], function (module) {
  
  'use strict';

  module.registerController('ExecutionCtrl', [
    '$rootScope','$scope', '$state', '$stateParams', 'SuiteService', 'KeywordService',
    function($rootScope,$scope, $state, $stateParams, SuiteService, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'EXECUTION';

      var selected = [];

      var checkProjectStatus = function() {
        if ($scope.project.status == 'RUNNING') {
          $.SmartMessageBox({
            title: $rootScope.getWord('Project Execution Alert') +'!',
            content: $rootScope.getWord('Your project has been already running. Please back to overview tab to track project progress'),
            buttons: '['+$rootScope.getWord('Go to overview')+']'
          }, function (ButtonPressed) {
            if (ButtonPressed === $rootScope.getWord('Go to overview')) {
              $state.go('app.keyword', {id: $scope.projectId});
            }
          });
          return false;
        }

        return true;
      }

      KeywordService.get($scope.projectId, function(project) {
        $scope.project = project;
        $scope.project.browser = "firefox";
        $scope.project.version = "41.0.2"
        checkProjectStatus();
      });

      SuiteService.list($scope.projectId, function(response) {
        $scope.suites = response;
      });

      $scope.selectSuite = function (suiteId) {

        var $btnRun = $('.btn.btn-primary.btn-keyword-run');

        if (_.indexOf(selected, suiteId) != -1) {
          _.remove(selected, function(sel) {
            return sel == suiteId;
          });
        } else {
          selected.push(suiteId);
        }

        if (selected.length > 0) $btnRun.removeClass('disabled');
        else $btnRun.addClass('disabled');
      }

      $scope.run = function() {
        if (checkProjectStatus())

        var options = {
          browser: $scope.project.browser,
          version: $scope.project.version
        }
        KeywordService.run($scope.projectId, selected, options, function (data, status) {
          switch (status) {
            case 201:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been already running'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not submmit your project job'),
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

          }
          $state.go('app.keyword', {id:$scope.projectId});
        });
      }
  }]);
});