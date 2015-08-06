define(['keyword/module'], function (module) {
  'use strict';

  module.registerDirective('tabsHeader', ['$state', function($state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/keyword/directives/tabs-header.tpl.html',
      link: function(scope, element, attributes) {

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