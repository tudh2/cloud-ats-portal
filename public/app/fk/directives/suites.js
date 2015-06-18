define(['fk/module','lodash'], function(module, _) {
	'use strict';
	module.registerDirective('suites', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/fk/directives/suites.tpl.html',
			link: function($scope, element, attributes) {
				
				$scope.suitecount = 0;
				$scope.editableOptions = {
    			mode: 'inline',
    			disabled: false
    		}

				$scope.newSuite = function() {
					$scope.suitecount++;
					$scope.suites.push({
						'name': 'NewSuite' + $scope.suitecount,
						'cases': []
					});
				}

				$scope.delSuite = function(index) {
					$scope.suites.splice(index, 1);
				}

				$scope.changeSuiteName = function(value,attributes) {
					var index = attributes.index;
					$scope.suites[index].name = value;
				}
				
				$scope.displayToolTip = function(step) {
					var display = "";
					var valueOfParam = "";
					$.each(step,function(key,value) {
						var indexStep =  key + 1;
						display += "<p><strong>Step "+indexStep+": " + value.type + "</strong> <br>";
						_.forEach(value.params, function(param) {
							if (param !== 'locator' && param !== 'targetLocator') {
								display += (value[param] + "<br>");
							} else {
								display += (param + " " + value[param].type + " " + value[param].value + "<br>"); 
							}
						});
						display += "</p>";

						// if(value.params.length != 0) {
						// 	$.each(value.params, function(keyParam,nameParam) {

						// 		$.each(value,function(keyStep,valueStep) {
						// 			if(nameParam === keyStep) {
						// 				valueOfParam = valueStep;
						// 			}
						// 		});
						// 		var indexParam = keyParam + 1;
						// 		display += "Param "+indexParam+": "+nameParam+"</br>";
						// 		display += "Value "+ nameParam +": "+valueOfParam+"</br>";
						// 		indexParam++;
						// 	});
						// }
						// +"</p>";
						indexStep ++;
					});
					return display;
				}
			} 
		}
	}]);
});