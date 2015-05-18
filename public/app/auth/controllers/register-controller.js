define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('RegisterCtrl', ['$scope', '$cookies', '$state' , 'AuthenticationService', RegisterCtrl]);

  function RegisterCtrl($scope, $cookies, $state, AuthenticationService) {
    $scope.email = '';
		$scope.password = '';
		$scope.firstname = '';
		$scope.lastname = '';

		AuthenticationService.getTenants(function(data){
			$scope.tenants = data;
		});


		$scope.checkTenant = function() {
			return false;
		}

    $scope.submit = function() {
      AuthenticationService.register($scope.email, $scope.password, $scope.firstname, $scope.lastname, function(data) {
      	if (data.error) {
      		console.log("error");
          $scope.message = data.message;          
        } else {
        	console.log("success");
        	$state.go('app.dashboard');
        }
      	
      });
    }
  }
});