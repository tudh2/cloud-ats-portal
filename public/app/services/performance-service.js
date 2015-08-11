define(['layout/module'], function (module) {

	'use strict';

	module.registerFactory('PerformanceService', ['$http', '$cookies', function ($http, $cookies) {

		return {
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
					url: appConfig.RestEntry + '/api/v1/project/performance/get/'+projectId,
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