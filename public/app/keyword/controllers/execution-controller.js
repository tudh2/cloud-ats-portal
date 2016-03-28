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
        $scope.project.browserVersion = "41.0.2";
        $scope.project.seleniumVersion = "2.48.2";
        $scope.project.os = "ubuntu";
        
        $scope.$watch('project.browser', function(newValue, oldValue, scope) {
          if (newValue === 'ie') scope.project.os = "windows";
          else scope.project.os = "ubuntu";
        });

        $scope.$watch('project.os', function(newValue, oldValue, scope) {
          if (newValue === 'windows' && scope.project.browser !== 'ie') {
            scope.project.os = 'ubuntu';
          }
          if (newValue === 'ubuntu' && scope.project.browser === 'ie') {
            scope.project.os = 'windows'; 
          }
        });

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
          browser_version: $scope.project.browserVersion,
          selenium_version : $scope.project.seleniumVersion
        };
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