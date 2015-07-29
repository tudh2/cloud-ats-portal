define(['dashboard/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective("closePopover", [ function() {
    return {
      restrict: 'A',
      replace: true,
      link: function($scope, element, attributes) {

        var init = function() {
          var options = {
            placement: function (context, source){
              var $position = $(source).position();
              if ($position.left > 500) {
                return "left";
              } else
              return "right";
            },
            trigger: 'click'
          };
          $('[data-toggle="popover"]').popover(options);
        }

        init();
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
