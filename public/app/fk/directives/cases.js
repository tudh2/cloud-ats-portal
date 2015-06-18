define(['fk/module','lodash'], function(module,_) {
	'use strict';
	module.registerDirective('listCases', [function() {
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

				$scope.removeCase = function(index) {
					$scope.list.splice(index,1);
				}

				$scope.moveUpAction = function(index,caseMove) {
					var caseTemp = {};
					var caseCopy = {};
					angular.copy($scope.list[index-1], caseTemp);
					if (caseTemp === undefined || caseTemp === null) return;
					angular.copy(caseMove,caseCopy);
					$scope.list[index] = caseTemp;
					$scope.list[index-1] = caseCopy;
				}

				$scope.moveDownAction = function(index,caseMove) {
					var caseTemp = {};
					var caseCopy = {};
					angular.copy($scope.list[index+1], caseTemp);
					if(caseTemp === undefined || caseTemp === null) return;
					angular.copy(caseMove,caseCopy);
					$scope.list[index] = caseTemp;
					$scope.list[index+1] = caseCopy;
				}
			}
		}
	}]);
});