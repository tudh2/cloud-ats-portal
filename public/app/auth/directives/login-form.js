define(['auth/module', 'bootstrap-validator'], function(module) {

	module.registerDirective('loginForm', function() {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/auth/directives/login-form.html',

			link: function(scope, form) {
				form.bootstrapValidator({

					feedbackIcons : {
						valid : 'glyphicon glyphicon-ok',
						invalid : 'glyphicon glyphicon-remove',
						validating : 'glyphicon glyphicon-refresh'
					},

					fields : {
						email : {
							validators : {
								notEmpty : {
									message : 'The email address is required'
								}
							}
						},
						password : {
							validators : {
								notEmpty : {
									message : 'The password is required'
								}
							}
						}
					}
				});

			}
		}
	})
});