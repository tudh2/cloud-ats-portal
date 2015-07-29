define(['console/module'], function(module) {
  'use strict';

  module.registerFactory('ConsoleService', ['$http', '$cookies', function($http, $cookies) {
    return {
      build: function(callback) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/keyword/build',
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