define(['app'], function (app) {
  'use strict';

  app.factory('EventService', ['$http', '$cookies', function($http, $cookies){
    return{
      feed: function(callback) {
        var token = $cookies.get('authToken');
        var feed = new EventSource(appConfig.RestEntry + '/api/v1/event/feed/' + token);
        feed.addEventListener("message", callback, false);
      },

      close: function() {
        
        var token = $cookies.get('authToken');

        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/event/close/' + token,
        };

        $http(request).success(function(data, status) {

        });
      }
    }
  }])
});