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
				var init = function(){
					$scope.cases = $scope.$parent.cases;
				}
				init();
				$scope.newSuite = function() {
					$scope.suites.push({
						'name': 'NewSuite',
						'cases': []
					})
				}
			} 
		}
	}]);
});