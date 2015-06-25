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

		$scope.createNewPerformanceTestWizard = function () {
			console.log('test wizard');
			$scope.wizard = true;
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
		        title: "Perfomance Test",
		        content: "<i class='fa fa-clock-o'></i> <i>Your performance test wizard has saved.</i>",
		       	color: "#659265",
		        iconSmall: "fa fa-check fa-2x fadeInRight animated",
		        timeout: 2000
		      });

		      $scope.list = true;
				}
			});
		}

		$scope.uploadTestPerformanceCompleteCallback = function (wizardData) {
			
			performanceService.createPerformanceTestByUpload($scope.file, wizardData.project_name, function (data, status){
				
				if (status == 200) {
					$.smallBox({
		       	title: "Performance Test",
		        content: "<i class='fa fa-clock-o'></i> <i>Your uploaded file has saved.</i>",
		       	color: "#659265",
		        iconSmall: "fa fa-check fa-2x fadeInRight animated",
		        timeout: 2000
		      });

		      $scope.list = true;
				}
			});
				
		}

		$scope.uploadFile = function (element) {
			$scope.file = element.files[0];

		}

		$scope.ExitToListPage = function () {
			$scope.list = true;
		}

		$scope.ExitToUploadFilePage = function () {
			$scope.list = false;
			$scope.wizard = false;
		}

	}]);
})