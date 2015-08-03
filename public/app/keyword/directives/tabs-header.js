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
              $scope.title = 'DATA DRIVEN';
              break;
            case 'suites':
              $scope.title = 'EXECUTION';
              break;
            case 'execution':
              break;
            default:
              break;
          }
        }
      }
    }
  }]);
});