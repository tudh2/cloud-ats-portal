define(['performance/module'], function (module) {
  'use strict';

  module.registerDirective('configurationScript', [function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'app/performance/directives/script-configuration.tpl.html',
      link: function(scope, element, attributes) {

        // set value for input slider
        $('#users').slider('setValue', scope.script.number_threads);
        $('#ramup').slider('setValue', scope.script.ram_up);
        $('#loops').slider('setValue', scope.script.loops);
        $('#duration').slider('setValue', scope.script.duration);
        $('#engines').slider('setValue', scope.script.number_engines);

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
          $('#users').slider('setValue', newValue);
        });

        scope.$watch('script.loops', function (newValue, oldValue) {
          if (newValue === undefined) {
            scope.script.loops = oldValue;
          }
          $('#loops').slider('setValue', newValue);
        });

        scope.$watch('script.ram_up', function (newValue, oldValue) {

          if (newValue === undefined) {
            scope.script.ram_up = oldValue;
          }
          $('#ramup').slider('setValue', newValue);
        });

        scope.$watch('script.number_engines', function (newValue, oldValue) {
          if (newValue === undefined) {
            scope.script.number_engines = oldValue;
          }
          $('#engines').slider('setValue', newValue);
         
        });
      }
    }
  }]);
});