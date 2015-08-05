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

        // show value slider in span tag
        $("#usersSliderVal").text(scope.script.users);
        $("#ramupSliderVal").text(scope.script.ramup);
        $("#loopsSliderVal").text(scope.script.loops);
        $("#durationSliderVal").text(scope.script.duration);

        // handle if user interact with slider 
        $("#users").on("slide", function(slideEvt) {
          $("#usersSliderVal").text(slideEvt.value);
          scope.script.number_threads = slideEvt.value;
        });
        $('#users').on('slideStop', function (slideEvt) {
          $("#usersSliderVal").text(slideEvt.value);
           scope.script.number_threads = slideEvt.value;
        });
        $("#ramup").on("slide", function(slideEvt) {
          $("#ramupSliderVal").text(slideEvt.value);
          scope.script.ram_up = slideEvt.value;
        });
        $("#ramup").on("slideStop", function(slideEvt) {
          $("#ramupSliderVal").text(slideEvt.value);
          scope.script.ram_up = slideEvt.value;
        });
        $("#loops").on("slide", function(slideEvt) {
          $("#loopsSliderVal").text(slideEvt.value);
          scope.script.loops = slideEvt.value;
        });
        $("#loops").on("slideStop", function(slideEvt) {
          $("#loopsSliderVal").text(slideEvt.value);
          scope.script.loops = slideEvt.value;
        });
        $("#duration").on("slide", function(slideEvt) {
          $("#durationSliderVal").text(slideEvt.value);
          scope.script.duration = slideEvt.value;
        });
        $("#duration").on("slideStop", function(slideEvt) {
          $("#durationSliderVal").text(slideEvt.value);
          scope.script.duration = slideEvt.value;
        });

      }
    }
  }]);
});