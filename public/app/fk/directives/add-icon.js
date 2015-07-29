define(['fk/module', 'lodash'], function(module, _) {
  
  'use strict';

  module.registerDirective('addIcon', [function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element, attributes) {
      	$(element).hover(
      		function(){
      			$(this).find("span:first").append('<span class="pull-right icon" ng-click="">'
        				+'<i class="glyphicon icon-delete glyphicon-remove-circle"></i>'
        				+'</span>');
      		}, function(){
      			$(this).find("span").remove('.icon');
      		})
      }
    }
  }]);

});
