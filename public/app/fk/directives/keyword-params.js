define(['fk/module', 'lodash'], function(module, _) {
  
  'use strict';

  module.registerDirective('keywordParams', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/keyword-params.tpl.html',
      scope: {
        list: '=',
        listIndex: '=',
        keyword: '='
      },
      link: function(scope, element, attributes) {

        scope.editableOptions = {
          mode: 'inline',
          disabled: false
        }

        scope.changeParamValue = function(value, attributes) {
          var listIndex = scope.listIndex;
          var keywordParam = attributes.keywordParam;
          
          var copy = {};
          angular.copy(scope.list[listIndex], copy);
          scope.list[listIndex] = copy;

          if (keywordParam === 'locator.type') {
            scope.list[listIndex].locator.type = value;
          } else if (keywordParam === 'locator.value') {
            scope.list[listIndex].locator.value = value;
          } else if (keywordParam === 'targetLocator.type') {
            scope.list[listIndex].targetLocator.type = value;
          } else if (keywordParam === 'targetLocator.value') {
          scope.list[listIndex].targetLocator.value = value;
            } else {
            scope.list[listIndex][keywordParam] = value;
          }
        };

        var buildParams = function() {
          var keyword = scope.keyword;
          var params = [];
          _.forEach(keyword.params, function(paramName) {
            var param = {"name": paramName};
            if (paramName === 'locator') {
              var locator = keyword.locator;
              if (locator === undefined) {
                param.type = "id";
                param.value = "";
              } else {
                param.type = locator.type;
                param.value = locator.value;
              }
            } else if (paramName === 'targetLocator') {
              var targetLocator = keyword.targetLocator;
              if (targetLocator === undefined) {
                param.type = "id";
                param.value = "";
              } else {
                param.type = targetLocator.type;
                param.value = targetLocator.value;
              }
            } else {
              param.value = keyword[paramName] ? keyword[paramName] : "";
            }
            params.push(param);
          });
          //
          return params;
        };

        scope.params = buildParams();
      }
    }
  }]);

});