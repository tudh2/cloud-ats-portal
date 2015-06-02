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

        if(typeof scope.successCallback() === 'function') {
          angular.extend(initOptions, {
            success: function(resp, newValue) {
              scope.successCallback()(newValue, attrs);
            }
          });
        }
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
        options: '=',
        successCallback: '&'
      },
      link: link
    }
  });
});