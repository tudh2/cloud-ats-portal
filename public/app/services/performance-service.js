define(['performance/module'], function (module) {

	'use strict';

	module.registerFactory('PerformanceService', ['$http', '$cookies', function ($http, $cookies) {

		return {
			createPerformanceTestWizard : function (data, callback) {
				var request = {
					method: 'POST',
					url: 'http://localhost:9000/api/v1/performance/createWizard',
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
			createPerformanceTestByUpload: function (files, project_name, callback) {
				var formData = new FormData();
				$.each(files, function (key, value) {

					formData.append(key, value);
				});

				var request = {
					method: 'POST',
					url: 'http://localhost:9000/api/v1/performance/uploadFile?project_name='+project_name,
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
			}
		}
	}]);
})