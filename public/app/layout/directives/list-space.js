define(['layout/module'], function(module) {
  'use strict';

  module.registerDirective('listSpace', ['$rootScope', 'UserService', function($rootScope, UserService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/layout/directives/list-space.tpl.html',
      link: function(scope, element) {
        
        scope.space = 'Public';

        UserService.spaces().then(function(spaces) {
          scope.spaces = spaces;
        });
      }
    }
  }]);
});