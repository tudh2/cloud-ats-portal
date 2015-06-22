define(['virtual/module'], function(module) {
  'use strict';

  module.registerFactory('VirtualService', ['$http','$cookies', function($http,$cookies) {
    return {
        getListSystem:function(callback) {
          var request = {
            method: 'GET',
            url: 'api/system-virtual-machine.json',
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'Content-Type': undefined
            }
          }

          $http(request)
          .success(function(data) {
            callback(data);
          })
          .error(function(data) {
            callback(data);
          });
    },

    getListTest:function(callback) {
    	var request = {
            method: 'GET',
            url: 'api/test-virtual-machine.json',
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'Content-Type': undefined
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