define(['fk/module','lodash'], function(module,_) {
	'use strict';
	module.registerDirective('listCases', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				list: '='
			},
			templateUrl: 'app/fk/directives/cases.tpl.html',

			link: function($scope,element,attributes) {
				$scope.dataList = [];
				var init = function(list) {
					$scope.dataList.push(list);
				}
				init();
			}
		}
	}]);
});