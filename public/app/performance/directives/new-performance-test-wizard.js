define(['performance/module'], function (module) {

	'use strict';
	module.registerDirective('newPerformanceTestWizard', [function () {

		return {
			restrict: 'E',
			templateUrl: 'app/performance/directives/new-performance-test-wizard.html',
			link : function (scope, element, attribute) {

				$('#users').bootstrapSlider('setValue', 200);
				$('#ramup').bootstrapSlider('setValue', 5);
				$('#loops').bootstrapSlider('setValue', 1);
				$('#duration').bootstrapSlider('setValue', 0);

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

			  scope.ExitToUploadFilePage = function () {
					scope.$parent.list = false;
					scope.$parent.wizard = false;
				}
			}
		}
	}]);
})