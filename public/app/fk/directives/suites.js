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
				
				$scope.displayToolTip = function(step) {
					var display = "";
					var valueOfParam = "";
					$.each(step,function(key,value) {
						var indexStep =  key + 1;
						display += ("<p><strong>Step "+indexStep+"</strong></br>"
						+"Type: "+value.type+"</br>Description: "+value.description+"</br>");

						if(value.params.length != 0) {
							$.each(value.params, function(keyParam,nameParam) {

								$.each(value,function(keyStep,valueStep) {
									if(nameParam === keyStep) {
										valueOfParam = valueStep;
									}
								});
								var indexParam = keyParam + 1;
								display += "Param "+indexParam+": "+nameParam+"</br>";
								display += "Value "+ nameParam +": "+valueOfParam+"</br>";
								indexParam++;
							});
						}
						+"</p>";
						indexStep ++;
					});
					return display;
				}
			} 
		}
	}]);
});