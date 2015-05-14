define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('LogoutCtrl', ['$scope', '$cookies', '$state', 'AuthenticationService', LogoutCtrl]);

  function LogoutCtrl($scope, $cookies, $state, AuthenticationService) {

  	$scope.logout = function () {

  		AuthenticationService.logout(function(data) {
        $state.go('login');
  		})
  	}
  }

});