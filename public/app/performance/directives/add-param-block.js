define(['performance/module'], function (module) {

	'use strict';
	module.registerDirective('addParamBlock', [function () {
		return {
			restrict: 'AE',
			link: function (scope, element, attribute) {

				element.on('click', function () {
					var param = {'name' : '', 'value' : ''};
					scope.params.push(param);
				});
			}

		}
	}]);
})