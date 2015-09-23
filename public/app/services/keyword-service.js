define(['keyword/module'], function(module) {
  'use strict';

  module.registerFactory('KeywordService', ['$http', '$cookies', function($http, $cookies) {
    return {

      run: function(projectId, listSuite, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/run',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: listSuite
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data, status);
        });
      },
      stop: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/stop',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data, status);
        });
      },
      list: function(callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keywords',
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

      get: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId,
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

      create: function(name, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/keyword',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: {
            name: name
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {

        });
      },
      update: function (id, name, callback) {
        var request = {
          method: 'PUT',
          url: appConfig.RestEntry + '/api/v1/project/keyword',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: {
            name: name,
            id: id
          }
        };

        $http(request).success(function (data, status) {
          callback(data, status);
        }).error(function (data, status) {
          callback(data, status);
        });
      },
      delete: function (id, callback) {
        var request = {
          method: 'DELETE',
          url: appConfig.RestEntry + '/api/v1/project/keyword',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: id
        };

        $http(request).success(function (data, status) {
          callback(data, status);
        }).error(function (data, status) {
          callback(data, status);
        });
      },
      getKeywords: function(callback) {
        $http.get('api/keywords.json').success(function(data) {
          if (typeof callback === 'function') {
            callback(data);
          }
        });
      },

      getReport : function(projectId,job_id,callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keyword/'+ projectId +'/report/'+ job_id,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data,status);
        });
      },
      getListReport : function(projectId,callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keyword/'+ projectId +'/reports',
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
});