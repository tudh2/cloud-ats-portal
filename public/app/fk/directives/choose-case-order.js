define(['fk/module', 'lodash'], function (module, _) {

	'use strict';
	module.registerDirective('chooseCaseOrder', [function () {

		return {
			restrict: 'A',
			link: function (scope, element, attribute) {

				element.on('click', function () {

					console.log(element);
					var i = 1;
					_.forEach(scope.testSuiteSelected.cases, function (caze) {
						element.append('<option>'+i+'</option>');
						i ++;
					});
				});
			}
		}
	}]);
});