define(['keyword/module'], function (module) {
  'use strict';

  module.registerFactory('CaseService', ['$http', '$cookies', function($http, $cookies) {
    return {
      list: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/cases' ,
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

      create: function(projectId, cases, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/case' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: cases
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data, status)
        });        
      },

      update: function(projectId, caze, callback) {
        var request = {
          method: 'PUT',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/case' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: caze
        };     

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data, status);
        });   
      }
    }
  }]);
});