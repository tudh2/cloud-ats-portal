define(['auth/module'], function(module) {

	'use strict';

	module.registerDirective('emailValidate', ['AuthenticationService',function(AuthenticationService) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {


				element.on('blur', function() {
					
					var email = element.val();
					var checkAccount = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(email);

					if (checkAccount == false) {
						scope.checkEmailPattern = true;
						scope.notify = 'The email must contain "., @" character ';
					} else {
						scope.checkEmailPattern = false;
						scope.notify = 'The email must contain "., @" character ';
					}
					AuthenticationService.checkAccount(email, function(data){
						if (data == 'false') {
	            scope.checkEmail = true;
	            scope.message = 'Email exists';
	          } else {
	          	scope.checkEmail = false;
	          }
					});
				});
			}	
		}

	}]);

});