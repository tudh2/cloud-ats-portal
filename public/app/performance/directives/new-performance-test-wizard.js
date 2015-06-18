define(['performance/module'], function (module) {

	'use strict';
	module.registerDirective('newPerformanceTestWizard', [function () {

		return {
			restrict: 'E',
			templateUrl: 'app/performance/views/new-performance-test-wizard.html',
			link : function (scope, element, attribute) {

				$('[name="userSlider"]').bootstrapSlider('setValue', 200);
				$('[name="ramupSlider"]').bootstrapSlider('setValue', 5);
				$('[name="loopsSlider"]').bootstrapSlider('setValue', 1);
				$('[name="durationSlider"]').bootstrapSlider('setValue', 0);

			}
		}
	}]);
})