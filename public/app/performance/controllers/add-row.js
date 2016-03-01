define(['performance/module', 'lodash'], function (module, _) {

	'use strict';
	module.registerController('AddRowCtrl', ['$scope', '$compile', '$templateRequest', function ($scope, $compile, $templateRequest) {

		$scope.doAddRowData = function () {

			$scope.data.push({id : 'id1', name : 'name1', score: 10});
		}
	}]);
})