define(['auth/module'], function (module) {

	'use strict';

	module.registerDirective('tenantValidate',[function () {

		return {
			restrict: 'A',
			link: function (scope, element, attribute) {

				element.on('blur', function() {

					if (scope.selectedTenant != null) {
						scope.chooseTenant = false;
					} else {
						scope.chooseTenant = true;
						scope.alert = 'You have to choose a tenant';
						element.parent().removeClass('state-success');
						element.parent().addClass('state-error');
					}
				});
				
			}
		}
	}]);
});