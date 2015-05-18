define(['auth/module'], function(module){


	return module.registerController('RegisterCtrl',['$scope', '$state', 'AuthenticationService', '$cookies', RegisterCtrl]);

		function RegisterCtrl($scope, $state, $cookies, AuthenticationService) {

			$scope.email = '';
			$scope.password = '';
			$scope.firstname = '';
			$scope.lastname = '';

			$scope.submit = function() {
				console.log('submit');
				var expires = new Date();
      	expires.setDate(expires.getDate() + 365);
				AuthenticationService.register($scope.email, $scope.password, $scope.firstname, $scope.lastname, function(data) {
					console.log('register');

				}); 

			}
		}

});