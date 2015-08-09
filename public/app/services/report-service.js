define(['performance/module'], function(module) {
  'use strict';

  module.registerFactory('ReportService', ['$http', '$cookies', function($http, $cookies) {
    return {
      get: function(id, callback) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/report/performance/sampler/'+id,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        });
      },
      report: function (projectId, jobId, callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/performance/report/'+projectId+'/'+jobId,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {

        });
      },
      getLastestRunning: function (projectId, callback) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/performance/report/lastjob/'+projectId,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        });
      }

    }
  }]);
})