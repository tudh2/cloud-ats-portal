define(['fk/module', 'modules/forms/common', 'jquery-maskedinput', 'jquery-validation'], function(module, formsCommon) {

  'use strict';

  module.registerDirective('providerForm', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/data-provider-form.tpl.html',
      link: function(scope, form) {

        form.validate(angular.extend({
          // Rules for form validation
          rules : {
            provider_name : {
                required : true
            }
          },

          // Messages for form validation
          messages : {
            provider_name : {
                required : 'Please enter your data provider name'
            }
          },

        }, formsCommon.validateOptions));
      }
    }
  }]);

});