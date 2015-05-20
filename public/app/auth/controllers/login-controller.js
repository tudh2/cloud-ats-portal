define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('LoginCtrl', ['$scope', '$cookies', '$state' , 'AuthenticationService', LoginCtrl]);

  function LoginCtrl($scope, $cookies, $state, AuthenticationService) {
    $scope.email = '';
    $scope.password = '';


    $scope.submit = function() {

      var expires = new Date();
      expires.setDate(expires.getDate() + 365);

      AuthenticationService.login($scope.email, $scope.password, function(data) {
        if (data.error) {
          $scope.message = data.message;          
        } else {
          $cookies.put('authToken', data.authToken, {
            expires: expires
          });

          $state.go('app.dashboard');
        }
      });
    }
  }
});