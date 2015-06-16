define(['functional/module'], function(module) {
  'use strict';

  module.registerFactory('FunctionalService', ['$http','$cookies', function($http,$cookies) {
    return {
        upload:function(file,callback) {
          var formData = new FormData();
          formData.append('file',file);
          var request = {
            method: 'POST',
            url: 'http://localhost:9000/api/v1/functional/upload',
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'Content-Type': undefined
            },
            data:formData
          }

          $http(request)
          .success(function(data) {
            callback(data);
          })
          .error(function(data) {
            callback(data);
          });
    }
  }
  }]);
});