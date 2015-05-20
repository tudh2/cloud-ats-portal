define(['auth/module'], function(module) {

	'use strict';

	module.registerDirective('emailValidate', ['AuthenticationService',function(AuthenticationService) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {
				element.on('blur', function() {
					var email = element.val();
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