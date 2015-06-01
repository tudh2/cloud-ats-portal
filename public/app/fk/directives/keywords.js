define(['fk/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective("keywords", [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/keywords.tpl.html',
      controller: ['$scope', '$filter', 'KeywordService', function($scope, $filter, keywordService) {
        
        $scope.list = [
        ];

        $scope.query = {
        }

        $scope.keywords = {
        }

        $scope.selectCat = function(cat) {
          $scope.cat = cat;
        }

        $scope.showMe = function() {
          return $scope.list.length == 0;
        }

        $scope.filterIt = function() {
          var cat = $scope.cat === undefined ? Object.keys($scope.query)[0] : $scope.cat;
          var query = $scope.query[cat];
          var keywords = $scope.keywords[cat];
          if (keywords !== undefined && query !== undefined) {
            return $filter('filter')(keywords, query);
          } else {
            return $filter('filter')($scope.keywords, "");
          }
        };

        $scope.removeAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          $scope.list.splice(index, 1);
        }

        $scope.moveUpAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          var upAction = $scope.list[index - 1];
          if (upAction === undefined || upAction === null) return;

          $scope.list[index] = upAction;
          $scope.list[index - 1] = keyword;
        }

        $scope.moveDownAction = function(keyword) {
          var index = _.indexOf($scope.list, keyword);
          var downAction = $scope.list[index + 1];
          if (downAction === undefined || downAction === null) return;

          $scope.list[index] = downAction;
          $scope.list[index + 1] = keyword;
        }

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

        keywordService.getKeywords(function(data) {
          $scope.keywordList = data;
          var cats = [];
          _.forEach(data, function(keywords, cat) {
            cats.push(cat);
          });
          $scope.cats = cats;
        });

        $scope.getKeywordsByCat = function(cat) {
          var keywords = []
          var keywordList = $scope.keywordList;

          _.forEach(keywordList[cat], function(content, keyword) {
            keyword = { "type": keyword }
            var paramsList = content.params;
            var params = [];
            _.forEach(paramsList, function(desc, param) {
              params.push(param);
            })
            keyword.params = params;
            keywords.push(keyword);
          });
          $scope.keywords[cat] = keywords;

          return keywords;
        };

        $scope.buildKeywordFullyQualified = function(keyword) {
          if (keyword.type.length > 10) return keyword.type;
          return $scope.buildActionDisplay(keyword);
        };

        $scope.buildParamsDisplay = function(params) {
          var displayParams = "";
          _.forEach(params, function(param) {
            displayParams += param;
            displayParams += ", ";
          });
          var lastComma = displayParams.lastIndexOf(',');
          if (lastComma != -1) {
            displayParams = displayParams.substring(0, lastComma);
          }
          return displayParams;
        };

      }],

      link: function(scope, element) {

        scope.editableOptions = {
          mode: 'inline',
          disabled: false
        }

      }
    }
  }]);
});