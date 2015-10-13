define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('LoginCtrl', 
  ['$scope', '$cookies', '$state', '$window', '$rootScope', 'AuthenticationService',
  function LoginCtrl($scope, $cookies, $state, $window, $rootScope, AuthenticationService) {
    $scope.email = '';
    $scope.password = '';


    $scope.submit = function() {

      var expires = new Date();
      expires.setDate(expires.getDate() + 365);
      if ($scope.email.trim() != '' && $scope.password.trim() != '') {

        AuthenticationService.login($scope.email, $scope.password, function(data) {
          if (data.error) {
            $scope.message = data.message;          
          } else {
            $cookies.put('authToken', data.authToken, {
              expires: expires
            });

            AuthenticationService.context().then(function(context) {
              $window.sessionStorage.setItem('context', JSON.stringify(context));
              $rootScope.context = context;
              $state.go('app.dashboard');
            });
          }
        });
      }
    }
  }]);
  
});