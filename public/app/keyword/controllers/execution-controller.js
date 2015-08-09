define(['keyword/module'], function (module) {
  
  'use strict';

  module.registerController('ExecutionCtrl', [
    '$scope', '$state', '$stateParams', 'SuiteService', 'KeywordService',
    function($scope, $state, $stateParams, SuiteService, KeywordService) {

    '$scope', '$stateParams', 'SuiteService', 'KeywordService',
    function($scope, $stateParams, SuiteService, KeywordService) {
      $scope.projectId = $stateParams.id;

      $scope.title = 'EXECUTION';

      var selected = [];

      var checkProjectStatus = function() {
        if ($scope.project.status == 'RUNNING') {
          $.SmartMessageBox({
            title: "Project Execution Alert!",
            content: "Your project has been already running. Please back to overivew tab to track project progress",
            buttons: '[Go to overview]'
          }, function (ButtonPressed) {
            if (ButtonPressed === "Go to overview") {
              $state.go('app.keyword', {id: $scope.projectId});
            }
          });
          return false;
        }

        return true;
      }

      KeywordService.get($scope.projectId, function(project) {
        $scope.project = project;
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

        KeywordService.run($scope.projectId, selected, function (data, status) {
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
          $state.go('app.keyword', {id:$scope.projectId});
        });
      }
  }]);
});