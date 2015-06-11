define(['fk/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective('listSteps', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/steps.tpl.html',
      scope: {
        list: '='
      },
      link: function($scope, element, attributes) {

        $scope.update = false;

        $scope.showMe = function() {
          return $scope.list.length == 0;
        }

        $scope.removeAction = function(index) {
          $scope.list.splice(index, 1);
        }

        $scope.moveUpAction = function(keyword) {
          $scope.update = true;
          var index = _.indexOf($scope.list, keyword);
          var upAction = {};
          angular.copy($scope.list[index - 1], upAction);
          if (upAction === undefined || upAction === null) return;

          var keywordCopy = {};
          angular.copy(keyword, keywordCopy);

          $scope.list[index] = upAction;
          $scope.list[index - 1] = keywordCopy;
          $timeout(function() {
            $scope.update = false;
          }, 1000);
        }

        $scope.moveDownAction = function(keyword) {
          $scope.update = true;
          var index = _.indexOf($scope.list, keyword);
          var downAction = {};
          angular.copy($scope.list[index + 1], downAction);
          if (downAction === undefined || downAction === null) return;

          var keywordCopy = {};
          angular.copy(keyword, keywordCopy);

          $scope.list[index] = downAction;
          $scope.list[index + 1] = keywordCopy;
          $timeout(function() {
            $scope.update = false;
          }, 1000);
        };

        $scope.buildActionDisplay = function(data) {
          var keyword = data.type;
          var params = data.params;
          keyword += " (";
          _.forEach(params, function(param) {
            keyword += param;
            keyword += ", ";
          });
          var lastComma = keyword.lastIndexOf(',');
          if (lastComma != -1) {
            keyword = keyword.substring(0, lastComma);
          }

          return keyword += ")";
        };

      }
    }
  }]);
});