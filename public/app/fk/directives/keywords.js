define(['fk/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective("keywords", ['$filter', 'KeywordService', function($filter, keywordService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/keywords.tpl.html',
      link: function($scope, element, attributes) {

        $scope.cases = [
          {
            "name": "NewCase",
            "steps": []
          }
        ];

        $scope.query = {}
        $scope.keywords = {}
        
        $scope.editableOptions = {
          mode: 'inline',
          disabled: false
        }

        $scope.changeCaseName = function(value, attributes) {
          var index = attributes.index;
          $scope.cases[index].name = value;
        }

        $scope.selectCat = function(cat) {
          $scope.cat = cat;
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
            var keyword = { "type": keyword };
            var paramsList = content.params;
            var params = [];
            _.forEach(paramsList, function(desc, param) {
              if (param === 'locator') {
                var locator = { "type" : "id", "value": "" };
                keyword.locator = locator;
              } else {
                keyword[param] = "";  
              }
              
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

      }

    }

  }]);
});