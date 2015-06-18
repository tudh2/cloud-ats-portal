
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

                    if (scope.selectedTenant == null) {
                        scope.chooseTenant = true;
                        scope.alert = 'You have to choose a tenant';
                        form.find('.select').removeClass('state-success');
                        form.find('.select').addClass('state-error');

                    }
                });
        		form.validate(angular.extend({

        			rules: {
        				password: {
        					required: true,
        					minlength: 3,
        					maxlength: 20
        				},
        				passwordConfirm: {
        					required: true,
        					minlength: 3,
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
        				password: {
        					required: 'Please enter your password'
        				},
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
