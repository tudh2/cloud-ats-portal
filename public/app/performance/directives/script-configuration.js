define(['performance/module'], function (module) {
  'use strict';

  module.registerDirective('configurationScript', [function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'app/performance/directives/script-configuration.tpl.html',
      link: function(scope, element, attributes) {

        // set value for input slider
        $('#users').bootstrapSlider('setValue', scope.script.number_threads);
        $('#ramup').bootstrapSlider('setValue', scope.script.ram_up);
        $('#loops').bootstrapSlider('setValue', scope.script.loops);
        $('#duration').bootstrapSlider('setValue', scope.script.duration);

        // handle if user interact with slider 
        $("#users").on("slide", function(slideEvt) {
          scope.script.number_threads = slideEvt.value;
        });
        $('#users').on('slideStop', function (slideEvt) {
           scope.script.number_threads = slideEvt.value;
        });
        $("#ramup").on("slide", function(slideEvt) {
          scope.script.ram_up = slideEvt.value;
        });
        $("#ramup").on("slideStop", function(slideEvt) {
          scope.script.ram_up = slideEvt.value;
        });
        $("#loops").on("slide", function(slideEvt) {
          scope.script.loops = slideEvt.value;
        });
        $("#loops").on("slideStop", function(slideEvt) {
          scope.script.loops = slideEvt.value;
        });
        $("#duration").on("slide", function(slideEvt) {
          scope.script.duration = slideEvt.value;
        });
        $("#duration").on("slideStop", function(slideEvt) {
          scope.script.duration = slideEvt.value;
        });


        scope.$watch('script.number_threads', function (newValue, oldValue) {

          if (validate(parseInt(newValue), 1000, 1)) {
            $('#users').bootstrapSlider('setValue', parseInt(newValue));
          } else scope.script.number_threads = oldValue;
        });

        scope.$watch('script.loops', function (newValue, oldValue) {
          if (validate(parseInt(newValue), 10, 1)) {
            $('#loops').bootstrapSlider('setValue', parseInt(newValue));
          } else scope.script.loops = oldValue;
        });

        scope.$watch('script.ram_up', function (newValue, oldValue) {
          if (validate(parseInt(newValue), 100, 1)) {
            $('#ramup').bootstrapSlider('setValue', parseInt(newValue));
          } else scope.script.ram_up = oldValue;
        });

        var validate = function(value, max, min) {
          if (!$.isNumeric(value) || value < min || value > max) {
            return false;
          }
          return true;
        }

      }
    }
  }]);
});