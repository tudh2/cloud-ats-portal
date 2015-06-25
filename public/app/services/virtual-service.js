define(['virtual/module'], function(module) {
  'use strict';

  module.registerFactory('VirtualService', ['$http','$cookies', function($http,$cookies) {
    return {
        getList:function(url,callback) {
          var request = {
            method: 'GET',
            url: url,
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken')
            }
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