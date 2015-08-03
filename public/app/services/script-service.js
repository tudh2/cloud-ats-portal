define(['performance/module'], function (module) {
  'use strict';

  module.registerFactory('ScriptService', ['$http', '$cookies', function($http, $cookies) {
    return {
      list: function(projectId, callback) {
        var request = {
          method: 'GET',
          url: 'http://localhost:9000/api/v1/project/performance/' + projectId + '/scripts' ,
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          }
        };

        $http(request).success(function(data, status) {
          callback(data);
        }).error(function(data, status) {

        });
      },
      createScriptTestByUpload: function (files, script_name, project_id, callback) {
        var formData = new FormData();
        $.each(files, function (key, value) {

          formData.append(key, value);
        });
        console.log(project_id);
        var request = {
          method: 'POST',
          url: 'http://localhost:9000/api/v1/project/performance/' + project_id + '/createScriptByFile',
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
      initScript: function (scriptName, projectId, callback) {
        var request = {
          method: 'POST',
          url: 'http://localhost:9000/api/v1/project/performance/'+ projectId + '/script',
          headers: {
            'X-AUTH-TOKEN': $cookies.get('authToken'),
            'X-SPACE': $cookies.get('space')
          },
          data: {
            scriptName : scriptName
          }
        }
        $http(request).success(function(data, status) {
          callback(data);
        }).error(function(data, status) {

        });
      }
    }
  }]);
});