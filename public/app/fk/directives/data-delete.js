define(['fk/module'], function (module) {

	module.registerDirective('deleteData', [function () {

		return {
			restrict: 'A',
			link: function (scope, element, attribute) {
				element.on('click', function () {
					element.parent().hide();
				});

			}
		}

	}]);
});