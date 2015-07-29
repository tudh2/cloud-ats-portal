define(['performance/module'], function (module) {

	'use strict';
	module.registerDirective('newPerformanceTestWizard', [function () {

		return {
			restrict: 'E',
			templateUrl: 'app/performance/directives/new-performance-test-wizard.html',
			link : function (scope, element, attribute) {

				// set value for input slider
				$('#users').bootstrapSlider('setValue', scope.configuration.users);
				$('#ramup').bootstrapSlider('setValue', scope.configuration.ramup);
				$('#loops').bootstrapSlider('setValue', scope.configuration.loops);
				$('#duration').bootstrapSlider('setValue', scope.configuration.duration);

				// show value slider in span tag
				$("#usersSliderVal").text(scope.configuration.users);
				$("#ramupSliderVal").text(scope.configuration.ramup);
				$("#loopsSliderVal").text(scope.configuration.loops);
				$("#durationSliderVal").text(scope.configuration.duration);

				// handle if user interact with slider 
				$("#users").on("slide", function(slideEvt) {
			    $("#usersSliderVal").text(slideEvt.value);
			  });
			  $('#users').on('slideStop', function (slideEvt) {
			  	$("#usersSliderVal").text(slideEvt.value);
			  });
			  $("#ramup").on("slide", function(slideEvt) {
			    $("#ramupSliderVal").text(slideEvt.value);
			  });
			  $("#ramup").on("slideStop", function(slideEvt) {
			    $("#ramupSliderVal").text(slideEvt.value);
			  });
			  $("#loops").on("slide", function(slideEvt) {
			    $("#loopsSliderVal").text(slideEvt.value);
			  });
			  $("#loops").on("slideStop", function(slideEvt) {
			    $("#loopsSliderVal").text(slideEvt.value);
			  });
			  $("#duration").on("slide", function(slideEvt) {
			    $("#durationSliderVal").text(slideEvt.value);
			  });
			  $("#duration").on("slideStop", function(slideEvt) {
			    $("#durationSliderVal").text(slideEvt.value);
			  });

			}
		}
	}]);
})