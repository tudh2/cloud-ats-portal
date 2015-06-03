define(['fk/module'], function (module) {

	module.registerDirective('tickBox', [function () {

		return {
			restrict: 'A',
			scope: {
				sel: '=',
				someCtrlFn: '&callFun'
			},
			link: function (scope, element, attribute) {
				element.on('click', function () {
						if(!element.children().hasClass("text-success")) {
				          	scope.someCtrlFn(scope.sel);
						}
				});

			}
		}

	}]);
});