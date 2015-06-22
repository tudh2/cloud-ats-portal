define(['performance/module', 'lodash'], function (module, _) {

	module.registerDirective('wizardSamplers', [function () {

		return {
			restrict: 'E',
			templateUrl: 'app/performance/directives/wizard-samplers.html',
			link: function (scope, element, attribute) {

				scope.selected = {
					sampler_method: 'GET',
					sampler_constantTime: '0',
					params: []
				};

				scope.addParamBlock = function() {
					var param = {'name' : '', 'value' : ''};
					scope.selected.params.push(param);

					var $collapse = $('#collapseOne-1');

					$collapse.collapse('show');
				}

				scope.removeParamBlock = function(index) {
					scope.selected.params.splice(index, 1);
				}

				scope.addSampler = function () {
					scope.samplers.push(scope.selected);
					scope.selected = {
						sampler_method: 'GET',
						sampler_constantTime: '0',
						params: []
					};
				}

				scope.select = function (sampler) {
					scope.selected = sampler;

					scope.create = false;
				}

				scope.deleteSampler = function (sampler) {
          $.SmartMessageBox({
          title: "Sampler",
          content: "Are you sure to delete sampler '" + sampler.sampler_name + "'?",
          buttons: '[No][Yes]'
	        }, function(ButtonPressed) {
	          if (ButtonPressed === "Yes") {
	            _.remove(scope.samplers, function(data) {
            		return sampler == data;
		          });
		          if (scope.samplers.length > 0) {
		          	 scope.selected = scope.samplers[0];
		          } else {
		          	scope.selected = {
									sampler_method: 'GET',
									sampler_constantTime: '0',
									params: []
								};
								scope.create = true;
		          }
		         
	          }
	        });
				}
				scope.clickNewSamplerButton = function () {
					scope.selected = {
						sampler_method: 'GET',
						sampler_constantTime: '0',
						params: []
					};
					scope.create = true;
				}
				scope.updateSampler = function () {

				}
			}
		}
	}]);
})