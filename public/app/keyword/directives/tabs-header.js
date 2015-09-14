define(['keyword/module'], function (module) {
  'use strict';

  module.registerDirective('tabsHeader', ['$rootScope','$state', function($rootScope,$state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/keyword/directives/tabs-header.tpl.html',
      link: function(scope, element, attributes) {
        var lang = $rootScope.lang;
        scope.$watch('lang', function(value) {
          if($rootScope.getWord){
            scope.getWord = function(key) {
              return $rootScope.getWord(key);
            }
          }
        }, true);
        scope.changeTab = function(tab) {
          switch(tab) {
            case 'overview':
              $state.go('app.keyword', { id : scope.projectId });
              break;
            case 'cases':
              $state.go('app.keyword.cases', { id : scope.projectId });
              break;
            case 'driven':
              $state.go('app.keyword.driven', { id : scope.projectId });
              break;
            case 'suites':
              $state.go('app.keyword.suites', { id : scope.projectId });
              break;
            case 'execution':
              $state.go('app.keyword.execution', { id : scope.projectId });
              break;
            default:
              break;
          }
        }
      }
    }
  }]);
});