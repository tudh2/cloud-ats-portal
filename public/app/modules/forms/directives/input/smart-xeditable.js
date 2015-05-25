define(['layout/module', 'x-editable'], function(module) {
  'use strict';

  return module.registerDirective('smartXeditable', function($timeout, $log) {

    function link(scope, element, attrs, ngModel) {
      var defaults = {

      };
      var inited = false;
      var initXeditable = function() {
        var options = scope.options || {};
        var initOptions = angular.extend(defaults, options);
        element.editable('destroy');
        element.editable(initOptions);
      }

      scope.$watch('options', function(newValue) {
        if (!newValue) return false;
        initXeditable();
      }, true);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        options: '='
      },
      link: link
    }
  });
});