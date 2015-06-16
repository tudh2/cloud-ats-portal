define(['functional/module'], function(module) {
  'use strict';

  module.registerFactory('FunctionalService', ['$http', function($http) {
    return {

      /*upload:function(callback) {
        var request = {
          method: 'POST',
          url: 'http://localhost:9001/#'
        }
        $http(request).success(function(){
          console.log("Success");
        }).error(function(data, status, headers, config) {
        if(status === 404) {

            console.log("Error upload");
        }
      });
      }*/
      /*upload:function(callback) {
      var request = {
        method: 'POST',
        url: 'http://localhost:9001/#'
      }

      $http(request)
      .success(function() {
        callback("Success");
      })
      .error(function(data, status, headers, config) {
        if(status === 404) {
          callback("Eror");
        }
      });
    }*/
    console.log("here");
    }
  }]);
});