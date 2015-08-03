define(['performance/module'], function (module) {
  'use strict';

  module.registerDirective('tabsHeaderPerformance', ['$state', function($state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/performance/directives/tabs-header.tpl.html',
      link: function(scope, element, attributes) {

        scope.changeTab = function(tab) {
          switch(tab) {
            case 'overview':
              $state.go('app.performance', { id : scope.projectId });
              break;
            case 'scripts':
              $state.go('app.performance.scripts', { id : scope.projectId });
              break;
            case 'execution':
              $state.go('app.performance.execution', { id : scope.projectId });
              break;
            default:
              break;
          }
        }
      }
    }
  }]);
});