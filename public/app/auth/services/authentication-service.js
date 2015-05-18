define(['app'], function(app) {

  'use strict';

  return app.factory('AuthenticationService', 

    ['$http', '$q', '$log', '$cookies', '$window', '$rootScope', '$state', '$stateParams',
    function($http, $q, $log, $cookies, $window, $rootScope, $state, $stateParams) {
    
    function login(email, password, callback) {
      var request = {
        method: 'POST',
        url: 'http://localhost:9000/api/v1/user/login',
        data: {
          email: email,
          password: password
        }
      }

      $http(request)
      .success(function(data) {
        callback(data);
      })
      .error(function(data, status, headers, config) {
        if(status === 401) {
          var data = {
            error: true,
            message : 'Username or password is incorrect'
          }
          callback(data);
        }
      });
    };

    function logout(callback) {
      var request = {
        method: 'GET',
        url: 'http://localhost:9000/api/v1/user/logout',
        headers: {
          'X-AUTH-TOKEN': $cookies.get('authToken')
        }
      }

      $http(request)
      .success(function() {
        $cookies.remove('authToken');
        $window.sessionStorage.removeItem('context');
        callback();
      })
    };

    function context() {

      var dfd = $q.defer();

      var request = {
        method: 'GET',
        url: 'http://localhost:9000/api/v1/context',
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
    };

    function verifyState(state) {
      if ($rootScope.context !== undefined) {
        var tenant = $rootScope.context.tenant._id.toLowerCase();

        if (!$stateParams.tenant || tenant != $stateParams.tenant) {
          $state.go(state, { tenant : tenant });
        }
      }
    };

    return {
      login: function(email, password, callback) {
        login(email, password, callback);
      },
      logout: function(callback) {
        logout(callback);
      },
      context: function() {
        return context();
      },
      verifyState: function(state) {
        return verifyState(state);
      }
    }
  }]);
});