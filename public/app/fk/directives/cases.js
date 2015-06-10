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

				$scope.showMe = function() {
					return $scope.list.length === 0;
				}

				$scope.removeCase = function(caseValue,index) {
					$scope.list.splice(index,1);
				}
			}
		}
	}]);
});