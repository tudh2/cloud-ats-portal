define(['performance/module', 'lodash'], function(module, _) {
  
  'use strict';

  module.registerDirective('removeSamplerButton', [function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element, attributes) {
        $(element).on('click', function () {

          var $grand = $(element).parent().parent().find('.remove-icon');
          _.forEach($grand, function (element) {
            var $parent = $(element).parent().parent();
            console.log($parent);
            $($parent).css("border", "");
            $($parent).css("margin-bottom", "");
            $($parent).css("padding", "");
            element.remove();
          });
          var $div = $(this).find('.number').parent();
          var $next = $($div).find('.remove-icon');
          
          if ($($next).hasClass('remove-icon')){
            $($next).remove();
            $(this).css("border", "");
            $(this).css("margin-bottom", "");
            $(this).css("padding", "");
          } else {
            $(this).css("background-color", "white");
            $(this).css("border", "1px solid #02B39F");
            $(this).css("margin-bottom", "10px");
            $(this).css("padding", "5px");
            $($div).append('<div class="col-sm-6 remove-icon"><span class="pull-right icon"><i class="fa icon-delete fa-minus-circle"></i></span></div>');
          }
        });
      }
    }
  }]);

});