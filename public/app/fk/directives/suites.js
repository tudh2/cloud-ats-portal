define(['fk/module','lodash'], function(module, _) {
	'use strict';
	module.registerDirective('suites', [function() {
		return {
			restrict: 'E',
			replace: true,
			scope:{},
			templateUrl: 'app/fk/directives/suites.tpl.html',
			link: function($scope, element, attributes) {
				
				$scope.suites = [
					{
						'name':'NewSuite',
						'cases': []
					}
				];

				$scope.editableOptions = {
          			mode: 'inline',
          			disabled: false
        		}

				var init = function(){
					$scope.cases = $scope.$parent.cases;
				}
				init();

				$scope.newSuite = function() {
					$scope.suites.push({
						'name': 'NewSuite',
						'cases': []
					});
					console.log($scope.suites);
				}

				$scope.delSuite = function(index) {
					$scope.suites.splice(index, 1);
				}

				$scope.changeSuiteName = function(value,attributes) {
					var index = attributes.index;
					$scope.suites[index].name = value;
				}
			} 
		}
	}]);
});