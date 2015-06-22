define(['performance/module'], function (module) {

	'use strict';
	module.registerDirective('removeParamBlock', [function () {
		return {
			restrict: 'AE',
			link: function (scope, element, attribute) {

				element.on('click', function () {

					var $parentElement = element.parent();
					$parentElement.remove();
				});

			}

		}
	}]);
})