define(['layout/module'], function (module) {

  'use strict';

  module.registerDirective('smartProjectsActive', ['$state', '$stateParams', '$rootScope',
    function($state, $stateParams, $rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attributes) {
        switch ($state.current.name) {
          case 'app.keyword':
          case 'app.keyword.cases':
          case 'app.keyword.driven':
          case 'app.keyword.suites':
          case 'app.keyword.execution':
          case 'app.projects':
            $(element).addClass('active');
            break;
          default:
            $(element).removeClass('active');
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
          switch (toState.name) {
          case 'app.keyword':
          case 'app.keyword.cases':
          case 'app.keyword.driven':
          case 'app.keyword.suites':
          case 'app.keyword.execution':
          case 'app.projects':
            $(element).addClass('active');
            break;
          default:
            $(element).removeClass('active');
          }
        })
      }
    }
  }]);

});