define(['selenium/module'], function (module) {
  'use strict';

  module.registerDirective('tabsHeaderUpload', ['$rootScope','$state', function($rootScope,$state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/selenium/directives/tabs-header.tpl.html',
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
              $state.go('app.selenium', { id : scope.projectId });
              break;
            case 'execution':
              $state.go('app.selenium.execution', { id : scope.projectId });
              break;
            default:
              break;
          }
        }
      }
    }
  }]);
});