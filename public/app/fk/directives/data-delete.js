define(['fk/module'], function (module) {

	module.registerDirective('deleteData', [function () {

		return {
			restrict: 'A',
			priority: 1,
			terminal: true,
			link: function (scope, element, attribute) {

				var msg = "Are you sure?";
				var clickAction = attribute.ngClick;
				element.bind('click', function () {
					if (window.confirm(msg)) {
						scope.$eval(clickAction);
						element.parent().remove();
					}
				});
			}
		}

	}]);
});