

define(['auth/module', 'modules/forms/common', 'jquery-maskedinput', 'jquery-validation'], function (module, formsCommon) {

	'use strict';

    return module.registerDirective('formValidate', function () {
        return {

        	restrict: 'A',
        	link: function (scope, form) {
        		form.validate(angular.extend({

        			rules: {
        				email: {
        					required: true
        					
        				},
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
        				email: {
        				//	required: 'Please enter your email address'
        				},
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
