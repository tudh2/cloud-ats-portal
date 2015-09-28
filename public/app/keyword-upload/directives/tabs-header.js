define(['keyword-upload/module'], function (module) {
  'use strict';

  module.registerDirective('tabsHeaderUpload', ['$rootScope','$state', function($rootScope,$state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/keyword-upload/directives/tabs-header.tpl.html',
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
              $state.go('app.keyword-upload', { id : scope.projectId });
              break;
            case 'execution':
              $state.go('app.keyword-upload.execution', { id : scope.projectId });
              break;
            default:
              break;
          }
        }
      }
    }
  }]);
});