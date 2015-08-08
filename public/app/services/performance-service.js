define(['layout/module'], function (module) {

	'use strict';

	module.registerFactory('PerformanceService', ['$http', '$cookies', function ($http, $cookies) {

		return {

			list: function (pageNumber, callback) {
				var request = {
					method: 'GET',
					url: 'api/project-list-'+pageNumber+'.json'
				}

				$http(request).success(function (data) {
					callback(data);
				}).error(function () {});
			},
			createPerformanceTestWizard : function (data, callback) {
				var request = {
					method: 'POST',
					url: appConfig.RestEntry + '/api/v1/performance/createWizard',
					headers: {
						'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: data
				}

				$http(request).success(function (data, status) {
					callback(data, status);
				}).error(function () {

				});
			},
			createPerformanceTestByUpload: function (files, script_name, project_id, callback) {
				var formData = new FormData();
				$.each(files, function (key, value) {

					formData.append(key, value);
				});
				console.log(project_id);
				var request = {
					method: 'POST',
					url: appConfig.RestEntry + '/api/v1/performance/uploadFile?script_name='+script_name+'&project_id='+project_id,
					headers: {
						'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space'),
            'Content-Type': undefined
					},
					data: formData
					
				}

				$http(request).success(function (data, status){
					callback(data, status);
				}).error(function() {});
			},
			updatePerformanceTestWizard: function (data, callback) {

				var request = {
					method: "PUT",
					url: appConfig.RestEntry + '/api/v1/performance/updateScript',
					headers: {
						'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
					},
					data: data
				}

				$http(request).success(function (data, status) {
					callback(data, status);
				}).error(function () {});
			},
			projects: function(callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/performances',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data);
        }).error(function(data, status) {

        });
      },
			get: function (projectId, callback) {
				var request = {
					method: "GET",
					url: appConfig.RestEntry + '/api/v1/project/performance/getProjectById/'+projectId,
					headers: {
						'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
					}
				}
				$http(request).success(function (data, status) {
					callback(data);
				}).error(function (data, status) {


				});
			},
			create: function(name, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/performance',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: {
            name: name
          }
        };

        $http(request).success(function(data, status) {
          callback(data);
        }).error(function(data, status) {

        });
      },
      run: function (projectId, suiteIds, callback) {
      	 var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/performance/run/'+projectId,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: suiteIds 
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {

        });
      },
      report: function (callback) {
      	var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/performance/report',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {

        });
      }
		}
	}]);
})