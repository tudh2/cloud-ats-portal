define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('RegisterCtrl', ['$scope', '$cookies', '$state' , 'AuthenticationService', RegisterCtrl]);

  function RegisterCtrl($scope, $cookies, $state, AuthenticationService) {
    $scope.email = '';
		$scope.password = '';
		$scope.firstname = '';
		$scope.lastname = '';
    $scope.space = '';
		AuthenticationService.getTenants(function(data){
			$scope.tenants = data;

      if (data.length > 0) {
        $scope.checkTenant = true;
      } else {
        $scope.checkTenant = false;
      }
		});
    console.log($scope.selectedTenant);
    $scope.submit = function() {
      AuthenticationService.register($scope.email, $scope.password, $scope.firstname, $scope.lastname, $scope.selectedTenant, $scope.space, function(data) {
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