define(['fk/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective("closePopover", ['$compile', function($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element, attributes) {
        $('[data-toggle="popover"]').popover({
          'placement': function (context, source){
            var $position = $(source).position();
            if ($position.left > 500) {
              return "left";
            } else
            return "right";
          },
          'html': true,
          'container': 'body',
          'trigger': 'click'
        }).click(function(ev) {
          $compile($('.popover.in').contents())(scope);
        });

        $('body').on('click', function (e) {
          $('[data-toggle="popover"]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
              $(this).popover('hide');
            }
          });
        });

      } 
    }
  }]);
});
