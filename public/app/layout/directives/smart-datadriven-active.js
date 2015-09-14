define(['layout/module'], function (module) {

  'use strict';

  module.registerDirective('smartDatadrivenActive', ['$state', '$stateParams', '$rootScope',
    function($state, $stateParams, $rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attributes) {
        switch ($state.current.name) {
          case 'app.datadriven':
            $(element).addClass('active');
            break;
          default:
            $(element).removeClass('active');
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
          switch (toState.name) {
          case 'app.datadriven':
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