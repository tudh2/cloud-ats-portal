define(['performance/module', 'notification'], function (module) {

	module.registerController('PerformanceCtrl', ['$scope', 'PerformanceService', function ($scope, performanceService) {

		$scope.list = true;
		$scope.samplers = [];
		$scope.create = true;
		$scope.wizard = false;
		$scope.finish = false;
		$scope.update = false;
		$scope.totalProjects = 22;
		$scope.currentPage = 1;

		$scope.configuration = {
			'users': 200,
			'ramup': 5,
			'loops': 1,
			'duration': 0
		};

		$scope.scriptId = undefined;
		// handle project list
		performanceService.list(1, function (data) {
			$scope.projects = data.data;
		});

		// get project list when page number was changed
		$scope.pageChanged = function (currentPage) {
			performanceService.list(currentPage, function (data) {
				$scope.projects = data.data;
			});
			$scope.currentPage = currentPage;
		}

		// show and hide scripts into each project
		$scope.showScripts = function ($event) {

			var $td = $event.currentTarget;

			var $div = $($td).closest("tr").next("tr").find("div.scripts");
			var $icon = $($td).find("i.fa");

			if ($($div).css('display') == 'none') {
				$($div).slideDown(400);
				$($icon).removeClass("fa-plus");
				$($icon).addClass("fa-minus");
			} else {
				$($div).slideUp(400);
				$($icon).removeClass("fa-minus");
				$($icon).addClass("fa-plus");
			}
		}
    
		// when click delete project button
		$scope.deleteProject = function (id) {
			var totalProjects = $scope.totalProjects;
			$.SmartMessageBox({
        title: "Sampler",
        content: "Are you sure to delete project '" + id + "'?",
        buttons: '[No][Yes]'
        }, function(ButtonPressed) {
          if (ButtonPressed === "Yes") {
            
            _.remove($scope.projects, function (data) {
            	return data._id == id;

            });

            // push a new project into current project list
            $scope.totalProjects = totalProjects - 1;
            var numPages = $scope.totalProjects/10;
            if ($scope.totalProjects/10 - Math.round($scope.totalProjects/10) != 0) {
            	numPages = Math.round($scope.totalProjects/10) + 1;
            }
            // get a new project from next page
						if ($scope.currentPage != numPages) {
							performanceService.list($scope.currentPage + 1, function (data) {
								if (data.data.length > 0) {
									var project = data.data[0];
									$scope.projects.push(project);
								}
								
							});		 
						}
						        
          }
        });
		}

		// moving update project page by id
		$scope.updateProject = function (id) {
			console.log(id);			
		}

		// moving update script page by id
		$scope.updateScript = function (script) {

			$scope.list = false;
			$scope.wizard = true;
			$scope.project_name = script.name;
			$scope.samplers = script.samplers;
			$scope.configuration = {
				'users': script.users,
				'ramup': script.ramup,
				'loops': script.loops,
				'duration': script.duration
			};

			$scope.scriptId = script._id;
		}

		// moving between directives
		$scope.createNewPerformanceTest = function () {
			$scope.list = false;
			$scope.wizard = false;
		}

		$scope.createNewPerformanceTestWizard = function () {
			$scope.wizard = true;
		}


		// click finish button when using wizard samplers
		$scope.wizard2TestPerformanceCompleteCallback = function (wizardData) {
			
			var $users = $('#users').bootstrapSlider('getValue');
			var $ramup = $('#ramup').bootstrapSlider('getValue');
			var $loops = $('#loops').bootstrapSlider('getValue');
			var $duration = $('#duration').bootstrapSlider('getValue');

			var object = {'project_name': wizardData.project_name, 'users' : $users, 'ramup' : $ramup, 'loops' : $loops, 'duration' : $duration, 'samplers': $scope.samplers};
			if ($scope.scriptId != undefined) {
				$scope.scriptId = '8ac6a426-7f7a-4949-a95c-ca63fc72523e';
				object = {'script_id': $scope.scriptId,'project_name': wizardData.project_name, 'users' : $users, 'ramup' : $ramup, 'loops' : $loops, 'duration' : $duration, 'samplers': $scope.samplers};
				performanceService.updatePerformanceTestWizard(object, function (data, status) {

					if (status == 200) {
						$.smallBox({
			        title: "Perfomance Test",
			        content: "<i class='fa fa-clock-o'></i> <i>Your performance test wizard has updated.</i>",
			       	color: "#659265",
			        iconSmall: "fa fa-check fa-2x fadeInRight animated",
			        timeout: 2000
			      });
			      $scope.list = true;
					}
				});
			} else {
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
		}

		// click finish button when using files upload
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

		// check step when using wizard directive
		$scope.wizard2TestPerformanceStepCallback = function (step, data) {
			if (step == 2) {
				$scope.finish = true;
			} else $scope.finish = false;
		}

		// get files after files were uploaded
		$scope.uploadFile = function (element) {
			$scope.file = element.files;
			delete $scope.file.length;

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