define(['auth/module'], function (module) {

	'use strict';

	module.registerDirective('tenantValidate',[function () {

		return {
			restrict: 'A',
			link: function (scope, element, attribute) {

				element.on('blur', function() {

					console.log(scope.selectedTenant);

					if (scope.selectedTenant != null) {
						scope.chooseTenant = false;
					} else {
						scope.chooseTenant = true;
						scope.alert = 'You have to choose a tenant';
					}
				});
				
			}
		}
	}]);
});