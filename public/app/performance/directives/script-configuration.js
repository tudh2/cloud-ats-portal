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
        $('#engines').bootstrapSlider('setValue', scope.script.number_engines);

        // handle if user interact with slider 
        $("#users").on("slide", function(slideEvt) {
          scope.script.number_threads = slideEvt.value;
        });
        $('#users').on('slideStop', function (slideEvt) {
           scope.script.number_threads = slideEvt.value;
        });
        $("#engines").on("slide", function(slideEvt) {
          scope.script.number_engines = slideEvt.value;
        });
        $('#engines').on('slideStop', function (slideEvt) {
           scope.script.number_engines = slideEvt.value;
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

        /*$('#usersSliderVal').on('keyup keydown', function (e) {
          if ($(this).val() > 1000) {
            $(this).val(1000);
            scope.script.number_threads = 1000;
          } else if ($(this).val() < 1 && $(this).val() != '') {
            $(this).val(1);
            scope.script.number_threads = 1;
          }
        });

        $('#ramupSliderVal').on('keyup keydown', function (e) {
          if ($(this).val() > 100) {
            $(this).val(100);
            scope.script.ram_up = 100;
          } else if ($(this).val() < 0 && $(this).val() != '') {
            $(this).val(0);
            scope.script.ram_up = 0;
          }
        });

         $('#enginesSliderVal').on('keyup keydown', function (e) {
          console.log($(this).val());
          if ($(this).val() > 5) {
            $(this).val(100);
            scope.script.number_engines = 5;
          } else if ($(this).val() < 1 && $(this).val() != '') {
            $(this).val(1);
            scope.script.number_engines = 1;
          } 
        });

        $('#loopsSliderVal').on('keyup keydown', function (e) {
          if ($(this).val() > 10) {
            $(this).val(10);

            scope.script.loops = 10;
          } else if ($(this).val() < 1 && $(this).val() != '') {
            $(this).val(1);
          }
        });
*/
        $('#usersSliderVal').on('blur', function () {
          if ($(this).val() == '') {
            scope.script.number_threads = 1;
          }
        });

        $('#ramupSliderVal').on('blur', function () {
          if ($(this).val() == '') {
            scope.script.ram_up = 0;
          }
        });

        $('#loopsSliderVal').on('blur', function () {
          if ($(this).val() == '') {
            scope.script.loops = 1;
          }
        });

        $('#enginesSliderVal').on('blur', function () {
          if ($(this).val() == '') {
            scope.script.number_engines = 1;
          }
        });

        scope.$watch('script.number_threads', function (newValue, oldValue) {
          if (newValue === undefined) {
            scope.script.number_threads = oldValue;
          }
          $('#users').bootstrapSlider('setValue', newValue);
        });

        scope.$watch('script.loops', function (newValue, oldValue) {
          if (newValue === undefined) {
            scope.script.loops = oldValue;
          }
          $('#loops').bootstrapSlider('setValue', newValue);
        });

        scope.$watch('script.ram_up', function (newValue, oldValue) {

          if (newValue === undefined) {
            scope.script.ram_up = oldValue;
          }
          $('#ramup').bootstrapSlider('setValue', newValue);
        });

        scope.$watch('script.number_engines', function (newValue, oldValue) {
          if (newValue === undefined) {
            scope.script.number_engines = oldValue;
          }
          $('#engines').bootstrapSlider('setValue', newValue);
         
        });
      }
    }
  }]);
});