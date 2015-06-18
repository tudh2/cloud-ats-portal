define(['performance/module'], function (module) {

	module.registerDirective('newPerformanceTest', [function () {

		return {

			restrict: 'E',
			templateUrl: 'app/performance/views/new-performance-test.html',
			link: function (scope, element, attribute) {

				scope.createNewPerformanceTestWizard = function () {

					if (scope.project_name == null || scope.project_name == "") {
						return;
					} else scope.$parent.wizard = true;
				}
			}
		}
	}]);
})