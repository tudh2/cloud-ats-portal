define(['keyword/module'], function(module) {
  'use strict';

  module.registerFactory('KeywordService', ['$http', '$cookies', function($http, $cookies) {
    return {

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
          callback(data);
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
          callback(data);
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
          callback(data);
        }).error(function(data, status) {

        });
      },

      getKeywords: function(callback) {
        $http.get('api/keywords.json').success(function(data) {
          if (typeof callback === 'function') {
            callback(data);
          }
        });
      }
    }
  }]);
});