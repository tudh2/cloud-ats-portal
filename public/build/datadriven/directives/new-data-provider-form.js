define(["fk/module","modules/forms/common","jquery-maskedinput","jquery-validation"],function(a,b){"use strict";a.registerDirective("newProviderForm",[function(){return{restrict:"E",replace:!0,templateUrl:"build/fk/directives/new-data-provider-form.tpl.html",link:function(a,c){c.validate(angular.extend({rules:{provider_name:{required:!0}},messages:{provider_name:{required:"Please enter your data provider name"}}},b.validateOptions))}}}])});