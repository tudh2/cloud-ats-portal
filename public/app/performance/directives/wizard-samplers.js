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
						/*var $form = element.find('.samplers .col-sm-8 .form-group');
						$form.removeClass('has-error');
						$form.removeClass('has-success');
						$form.find('.project-error').remove();*/
						scope.isEmptySamplerUrl = false;
						scope.isEmptyParam = false;
						scope.isEmptySamplerName = false;
					};
					
				}

				scope.select = function (sampler, index) {

					if (scope.isEmptySamplerName == true || scope.isEmptySamplerUrl == true || scope.isEmptyParam == true) {
						return false;
					} else {
						scope.selected = sampler;
						scope.selected.index = index;
						scope.create = false;
					}
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

					var check = true;
					if (sampler_name == undefined || sampler_url == undefined || sampler_name == '' || sampler_url == '') {
						
						if ((sampler_name == undefined || sampler_name == '')) {
							scope.isEmptySamplerName = true;
						}
						if ((sampler_url == undefined || sampler_url == '')) {
							scope.isEmptySamplerUrl = true;
						}
					
						check = false;
					}
					_.forEach(params, function(param) {
						console.log(param);
						if (param.name == '' || param.value == '') {
							console.log('param is empty');
							scope.isEmptyParam = true;
							check = false;

						}
					});
					return check
				}

				var $sampler_name = $('form .form-group .input-group').find('[name="sampler_name"]');

				$sampler_name.on('keyup', function () {
					if ($(this).val() == '') {
						scope.isEmptySamplerName = true;
					} else scope.isEmptySamplerName = false;
				});

				var $sampler_url = $('form .form-group .input-group').find('[name="sampler_url"]');
				
				$sampler_url.on('keyup', function () {
					if ($(this).val() == '') {
						scope.isEmptySamplerUrl = true;
					} else scope.isEmptySamplerUrl = false;
				});

				var $sampler_param = $('form .form-group .input-group #collapseOne-1 .panel-body').children();
				

			}
		}
	}]);
})