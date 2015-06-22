define(['performance/module', 'notification'], function (module) {

	module.registerController('PerformanceCtrl', ['$scope', 'PerformanceService', function ($scope, performanceService) {

		$scope.list = true;
		$scope.samplers = [];
		$scope.create = true;
		$scope.wizard = false;

		$scope.createNewPerformanceTest = function () {
			$scope.list = false;
			$scope.wizard = false;
		}

		$scope.wizard2TestPerformanceCompleteCallback = function (wizardData) {
			
			var $users = $('#users').bootstrapSlider('getValue');
			var $ramup = $('#ramup').bootstrapSlider('getValue');
			var $loops = $('#loops').bootstrapSlider('getValue');
			var $duration = $('#duration').bootstrapSlider('getValue');

			var object = {'project_name': wizardData.project_name, 'users' : $users, 'ramup' : $ramup, 'loops' : $loops, 'duration' : $duration, 'samplers': $scope.samplers};

			performanceService.createPerformanceTestWizard(object, function (data, status) {
				if (status == 200) {
					$.smallBox({
		        title: "Data Driven",
		        content: "<i class='fa fa-clock-o'></i> <i>Your performance test wizard has saved.</i>",
		       	color: "#659265",
		        iconSmall: "fa fa-check fa-2x fadeInRight animated",
		        timeout: 2000
		      });
				}
			});
		}

		$scope.uploadTestPerformanceCompleteCallback = function (wizardData) {
			
			if ($('#upload_file').val() != '') {
				console.log('uploaded file');
			}
		}

		$scope.uploadTestPerformanceStepCallback = function (step, wizardData) {
			if (step == 2) {
				$('.next').on('click', function () {
					var $file = $('#upload_file').val();

					if ($file == '') {
						$('.input.input-file').addClass('has-error');
					} else {
						$('.input.input-file').removeClass('has-error');
						$('.input.input-file').addClass('has-success');
					}
				});
			}
		}
		$scope.ExitToListPage = function () {
			$scope.list = true;
		}

	}]);
})