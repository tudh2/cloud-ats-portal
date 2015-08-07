define(['auth/module'], function(module) {
  "use strict";

  return module.registerDirective('loginInfo', ['$rootScope', function($rootScope){
    return {
      restrict: 'A',
      templateUrl: 'app/auth/directives/login-info.tpl.html',
      link: function($scope, $element) {
        var context = $rootScope.context;
        if(context !== undefined) $scope.currentUser = context.user;
      }
    };
  }]);
});
