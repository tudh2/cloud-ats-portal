define(['app'], function(app) {
  'use strict';

  app.factory('DataService', ['$http', '$q', '$cookies', '$rootScope', '$window', '$state',
    function($http, $q, $cookies, $rootScope, $window, $state){
      return {
        list: function(tenant, space) {
          var dfd = $q.defer();

          var request = {
            method: 'GET',
            url: 'http://localhost:9000/api/v1/data/list/' + tenant + '/' + space,
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken')
            }
          };

          $http(request)
          .success(function(response) {
            dfd.resolve(response);
          })
          .error(function(data, status) {
            switch (status) {
              case 403:
                $state.go('403');
                break;
              case 401:
                $state.go('401');
                break;
            }
            dfd.reject;
          });

          return dfd.promise;
        }
      }
  }]);
})