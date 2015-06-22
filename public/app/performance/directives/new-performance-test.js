define(['performance/module'], function (module) {

	module.registerDirective('newPerformanceTest', [function () {

		return {

			restrict: 'E',
			templateUrl: 'app/performance/directives/new-performance-test.html',
			link: function (scope, element, attribute) {

				scope.createNewPerformanceTestWizard = function () {

					scope.$parent.wizard = true;
				}
			}
		}
	}]);
})