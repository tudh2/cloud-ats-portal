define(['projects/module', 'lodash'], function(module, _) {

  'use strict';

  module.registerDirective("smartPopover", ['$compile', '$templateRequest',function($compile, $templateRequest) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element, attributes) {

        $templateRequest(attributes.popoverTemplate).then(function(template) {

          scope.projectId = attributes.projectId;
          scope.suites = attributes.projectSuites;
          scope.cases = attributes.projectCases;


          $(element).popover({
            'placement': function (context, source){
              var $container = $(source).closest('.project');
              var $position = $container.position();
              if ($position.left > 500) {
                return "left";
              } else
              return "right";
            },
            'html': true,
            'content': template,
            'container': 'body',
            'trigger': 'click'
          }).click(function(ev) {
            $compile($('.popover.in').contents())(scope);
          });
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
