define(['app'], function(app) {
  'use strict';

  app.factory('UserService', ['$http', '$q', '$cookies', '$rootScope', '$window',
    function($http, $q, $cookies, $rootScope, $window){
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
      },

      go: function(space) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/user/go/' + space._id,
          headers: {
           'X-AUTH-TOKEN': $cookies.get('authToken') 
          } 
        }

        $http(request).success(function(context) {
          $window.sessionStorage.setItem('context', JSON.stringify(context));
          $rootScope.context = context;
        });
      }
    };
  }])
});