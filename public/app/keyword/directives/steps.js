define(['keyword/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective('listSteps', ['$rootScope','$timeout', function($rootScope,$timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/keyword/directives/steps.tpl.html',
      scope: {
        list: '='
      },
      link: function($scope, element, attributes) {

        $scope.types = [
          {value: 'id', text: 'id'},
          {value: 'name', text: 'name'},
          {value: 'link text', text: 'link text'},
          {value: 'css selector', text: 'css selector'},
          {value: 'xpath', text: 'xpath'}
        ]; 

        $scope.getWord = function(key) {
          return $rootScope.getWord(key);
        }

        $scope.removeAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          $scope.list.splice(index, 1);
        }

        $scope.moveUpAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          var upAction = {};
          angular.copy($scope.list[index - 1], upAction);
          if (upAction === undefined || upAction === null) return;

          var keywordCopy = {};
          angular.copy(keyword, keywordCopy);

          $scope.list[index] = upAction;
          $scope.list[index - 1] = keywordCopy;
        }

        $scope.moveDownAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          var downAction = {};
          angular.copy($scope.list[index + 1], downAction);
          if (downAction === undefined || downAction === null) return;

          var keywordCopy = {};
          angular.copy(keyword, keywordCopy);

          $scope.list[index] = downAction;
          $scope.list[index + 1] = keywordCopy;
        };

        $scope.buildActionDisplay = function(data) {
          if (data._id !== undefined) {
            var customKeyword = _.remove($scope.list, function(sel) {
              return sel._id !== undefined;
            });

            _.forEach(customKeyword, function(sel) {
              _.forEach(sel.steps, function(step) {
                $scope.list.push(step);
              });
            });

            return;
          } else {

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

          }
        };

      }
    }
  }]);
});