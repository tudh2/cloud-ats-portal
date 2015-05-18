define(['app'], function(app) {
  'use strict';

  app.factory('UserService', ['$http', '$q', '$cookies', function($http, $q, $cookies){
    return {
      spaces: function(){
        var dfd = $q.defer();

        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/user/spaces',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken')
          }
        }

        $http(request)
        .success(function(response) {
          dfd.resolve(response);
        })
        .error(dfd.reject);

        return dfd.promise;
      }
    };
  }])
});