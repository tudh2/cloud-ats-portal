
define(['auth/module', 'modules/forms/common', 'jquery-maskedinput', 'jquery-validation'], function (module, formsCommon) {

	'use strict';

    return module.registerDirective('formValidate', function () {
        return {

        	restrict: 'A',
        	link: function (scope, form) {

                form.on('submit', function() {
                    if (scope.email == '') {
                        
                        scope.checkEmail = true;
                        scope.checkEmailPattern = false;
                        scope.message = 'The email is not empty';

                        form.find('[name=email]').parent().removeClass('state-success');
                        form.find('[name=email]').parent().addClass('state-error');
                    }
                    if (scope.password.length === 0) {
                        form.find('#password').parent().removeClass('state-success');
                        form.find('#password').parent().addClass('state-error');
                        scope.checkPass = true;
                        scope.message_pass = 'Please enter the password field' ;
                    }
                    if (scope.password.trim() ==='' && scope.password.length > 0){
                        form.find('#password').parent().removeClass('state-success');
                        form.find('#password').parent().addClass('state-error');
                        scope.checkPass = true;
                        scope.message_pass = 'Please do not begin or end with blank space' ;
                    }
                    if (scope.selectedTenant == null) {
                        scope.chooseTenant = true;
                        scope.alert = 'You have to choose a tenant';
                        form.find('.select').removeClass('state-success');
                        form.find('.select').addClass('state-error');

                    }
                    
                });
        		form.validate(angular.extend({

        			rules: {
        				passwordConfirm: {
        					required: true,
        					minlength: 4,
        					equalTo: '#password'
        				},
        				firstname: {
        					required: true
        				},
        				lastname: {
        					required: true
        				},
        				tenant: {
        					required: true
        				}
        			},

        			messages: {
        				passwordConfirm: {
        					required: 'Please enter your password one more time',
        					equalTo: 'Please enter the same passwordConfirm as above'
        				},
        				firstname: {
        					required: 'Please enter your first name'
        				},
        				lastname: {
        					required: 'Please enter your last name'
        				},
        				tenant: {
        					required: 'Please choose tenant'
        				}
        			}
        		}, formsCommon.validateOptions));
        	}	
        }
    });
});
