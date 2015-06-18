define(['performance/module', 'lodash'], function (module, _) {

	module.registerDirective('wizardSamplers', [function () {

		return {
			restrict: 'E',
			templateUrl: 'app/performance/views/wizard-samplers.html',
			link: function (scope, element, attribute) {

				scope.addSampler = function () {
					var sampler = {};
					sampler.sampler_name = scope.sampler.sampler_name;
					sampler.assertText = scope.sampler.assertText;
					sampler.sampler_method = scope.sampler.sampler_method;
					sampler.sampler_url = scope.sampler.sampler_url;
					sampler.sampler_constantTime = scope.sampler.sampler_constantTime;
					sampler.params = scope.params;
					scope.samplers.push(sampler);
					scope.selected = sampler;
					scope.update = true;
				}

				scope.select = function (sampler) {
					console.log(sampler);
					scope.selected = sampler;
					scope.sampler = sampler;
					scope.params = sampler.params;
					scope.update = true;
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
		          scope.selected = scope.samplers[0];
		          scope.sampler = scope.samplers[0];
		          scope.params = scope.sampler.params;
	          }
	        });
				}
				scope.clickNewSamplerButton = function () {
					scope.update = false;
					scope.sampler = {};
					scope.params = [{'name' : '', 'value' : ''}];

				}

				scope.updateSampler = function () {

				}

				scope.$watch('params', function (newParams) {
					scope.params = newParams;
				});
			}
		}
	}]);
})