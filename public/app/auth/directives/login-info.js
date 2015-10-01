define(['auth/module'], function(module) {
  "use strict";

  return module.registerDirective('loginInfo', ['$rootScope', function($rootScope){
    return {
      restrict: 'A',
      templateUrl: 'app/auth/directives/login-info.tpl.html',
      link: function($scope, $element) {
        $rootScope.$watch('context', function(newValue, oldValue) {
          var context = newValue;
          if(context !== undefined) $scope.currentUser = context.user;
        });
      }
    };
  }]);
});
