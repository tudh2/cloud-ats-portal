define(['performance/module'], function (module) {
  'use strict';

  module.registerFactory('ScriptService', ['$http', '$cookies', function($http, $cookies) {
    return {
      list: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/performance/' + projectId + '/scripts' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function (data, status) {
          callback(data);
        }).error(function (data, status) {

        });
      },
      createScriptTestByUpload: function (files, script_name, project_id, callback) {
        var formData = new FormData();
        $.each(files, function (key, value) {

          formData.append(key, value);
        });
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/performance/' + project_id + '/upload',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space'),
            'Content-Type': undefined
          },
          data: formData
          
        }

        $http(request).success(function (data, status){
          callback(data, status);
        }).error(function() {});
      },
      createScript: function (script, projectId, callback) {
        var request = {
          method: 'POST',
          url: appConfig.RestEntry + '/api/v1/project/performance/'+ projectId + '/script',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: script
        }
        $http(request).success(function (data, status) {
          callback(data);
        }).error(function (data, status) {

        });
      },
      get: function (projectId, id, callback) {

         var request = {
          method: 'GET',
          url: appConfig.RestEntry + '/api/v1/project/performance/'+ projectId +'/script/'+id,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        }

        $http(request).success(function (data, status) {
          callback (data, status);
        }).error(function (status, data) {
          callback(data, status);
        });
      },
      delete: function (projectId, id, callback) {
        var request = {
          method: 'DELETE',
          url: appConfig.RestEntry + '/api/v1/project/performance/'+ projectId+ '/script/'+id,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        }

        $http(request).success(function (data, status) {
          callback(data, status);
        }).error(function (data, status) {

        });
      },
      update: function (projectId, script, callback) {
        var request = {
          method: 'PUT',
          url: appConfig.RestEntry + '/api/v1/project/performance/'+ projectId +'/script',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: script
        }

        $http(request).success(function (data, status) {
          callback(data, status);
        }).error(function (data, status) {});
      }
    }
  }]);
});