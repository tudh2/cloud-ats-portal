define(['keyword/module'], function (module) {
  
  'use strict';

  module.registerController('ExecutionCtrl', [
    '$scope', '$stateParams', 'SuiteService', 'KeywordService',
    function($scope, $stateParams, SuiteService, KeywordService) {
      $scope.projectId = $stateParams.id;

      $scope.title = 'EXECUTION';

      var selected = [];

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
        KeywordService.run($scope.projectId, selected, function (data, status) {
          console.log(data);
          console.log(status);
        });
      }
  }]);
});