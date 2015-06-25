define(['performance/module', 'lodash', 'jquery-validation'], function (module, _) {

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
					
					if (samplerValidation(scope.selected)) {
						scope.samplers.push(scope.selected);
						scope.selected = {
							sampler_method: 'GET',
							sampler_constantTime: '0',
							params: []
						};
						var $form = element.find('.samplers .col-sm-8 .form-group');
						$form.removeClass('has-error');
						$form.removeClass('has-success');
						$form.find('.project-error').remove();
					};
					
				}

				scope.select = function (sampler, index) {
					scope.selected = sampler;

					scope.selected.index = index;
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
				
				var samplerValidation = function (sampler)  {

					var sampler_name = sampler.sampler_name;
					var sampler_url = sampler.sampler_url;
					var params = sampler.params;

					var error = "<span class='project-error' style='color: #b94a48;'>The field is required</span>";
					var check = true;
					if (sampler_name == undefined || sampler_url == undefined || sampler_name == '' || sampler_url == '') {
						
						var $sampler_name = element.find('.form-group.sampler-name');
						var $sampler_url = element.find('.form-group.sampler-url');
						if ((sampler_name == undefined || sampler_name == '') && !$sampler_name.hasClass('has-error')) {
							$sampler_name.addClass('has-error');
							$sampler_name.append(error);
						}
						if ((sampler_url == undefined || sampler_name == '') && !$sampler_url.hasClass('has-error')) {
							
							$sampler_url.addClass('has-error');
							$sampler_url.append(error);
						}
					
						check = false;
					}
					_.forEach(params, function(param) {
						console.log(param);
						if (param.name == '' || param.value == '') {
							console.log('param is empty');
							check = false;
						}
					});
					return check
				}
			}
		}
	}]);
})