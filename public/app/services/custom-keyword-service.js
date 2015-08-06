define(['keyword/module'], function (module) {
  'use strict';

  module.registerFactory('CustomKeywordService', ['$http', '$cookies', function($http, $cookies) {
    return {
      create: function(projectId, customKeyword, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/keyword/' + projectId + '/custom' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: customKeyword
        };

        $http(request).success(function(data, status) {
          callback(data, status);
        }).error(function(data, status) {
          callback(data, status)
        });        
      }
    }
  }]);
});