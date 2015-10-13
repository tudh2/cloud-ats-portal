define(['auth/module'], function(module) {

	'use strict';

	module.registerDirective('passwordValidate', ['AuthenticationService',function(AuthenticationService) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {

				scope.checkPass = false;
				element.on('blur', function() {
					var pass = element.val();
					var first = pass.charAt(0);
					var last = pass.charAt(pass.length - 1);
					if (first === null || first === ' ' || last === null || last === ' ' || (pass.length > 0 && pass.trim().length === 0)) {
						element.parent().removeClass('state-success');
						element.parent().addClass('state-error');
						scope.checkPass = true;
						scope.message_pass = 'Please do not begin or end with blank space' ;
					} else if (pass.length === 0) {
						element.parent().removeClass('state-success');
						element.parent().addClass('state-error');
						scope.checkPass = true;
						scope.message_pass = 'Please enter the password field' ;
					}	else if (pass.trim().length < 4) {
						element.parent().removeClass('state-success');
						element.parent().addClass('state-error');
						scope.checkPass = true;
						scope.message_pass = 'Please enter at least 4 characters' ;
					} else
						scope.checkPass = false;
				});
			}	
		}

	}]);

});