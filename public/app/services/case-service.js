define(['keyword/module'], function (module) {
  'use strict';

  module.registerFactory('CaseService', ['$http', '$cookies', function($http, $cookies) {
    return {
      list: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/project/keyword/' + projectId + '/cases' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data);
        }).error(function(data, status) {

        });
      }
    }
  }]);
});