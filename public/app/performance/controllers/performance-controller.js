define(['performance/module', 'notification'], function (module) {

	module.registerController('PerformanceCtrl', ['$scope', function ($scope) {

		$scope.list = true;
		$scope.samplers = [];
		$scope.params = [{'name' : '', 'value' : ''}];
		$scope.update = false;
		$scope.createNewPerformanceTest = function () {
			$scope.list = false;
			$scope.wizard = false;
		}

		$scope.cancelWizard = function () {
			$scope.list = true;
		}

		$scope.wizard2TestPerformanceCompleteCallback = function () {
			
			var $users = $('[name="userSlider"]').bootstrapSlider('getValue');
			var $ramup = $('[name="ramupSlider"]').bootstrapSlider('getValue');
			var $loops = $('[name="loopsSlider"]').bootstrapSlider('getValue');
			var $duration = $('[name="durationSlider"]').bootstrapSlider('getValue');

			$scope.configuration = {'user' : $users, 'ramup' : $ramup, 'loops' : $loops, 'duration' : $duration};
			console.log($scope.configuration);
			console.log($scope.samplers);
			$.smallBox({
        title: "Data Driven",
        content: "<i class='fa fa-clock-o'></i> <i>Your performance test wizard has saved.</i>",
       	color: "#659265",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
		}

		$scope.removeParamBlock = function (param) {
			console.log('remove param');
			_.remove($scope.params, function (data) {
				return param == data;
			});
			console.log($scope.params);
		}

	/*	$scope.clickNewSamplerButton = function () {
			$scope.update = false;
			$scope.sampler = {};
			$scope.params = [{'name' : '', 'value' : ''}];
		}*/


	}]);
})