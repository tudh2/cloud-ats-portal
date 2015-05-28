define(['fk/module'], function (module) {

	module.registerDirective('tickBox', [function () {

		return {
			restrict: 'A',
			link: function (scope, element, attribute) {
				element.on('click', function () {
					if (element.children().hasClass("fa-circle-o")){
						scope.delete = true;
						element.find('i').removeClass('fa-circle-o');
						element.find('i').addClass('fa-check-circle-o');
						element.removeClass('active');
					} else {
							element.addClass("active");
							scope.delete = false;
							element.find('i').removeClass('fa-check-circle-o');
							element.find('i').addClass('fa-circle-o');
						}
				});

			}
		}

	}]);
});