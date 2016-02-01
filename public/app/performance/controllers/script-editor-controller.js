define(['performance/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ScriptEditorCtrl', 
    ['$scope', '$rootScope', '$state','$stateParams', '$cookies', 'Upload', 'ScriptService', 
    function($scope, $rootScope, $state, $stateParams, $cookies, Upload, ScriptService) {
      $scope.projectId = $stateParams.id;
      $scope.scriptId = $stateParams.scriptId;

      ScriptService.get($scope.projectId, $scope.scriptId, function (data, status) {
        $scope.script = data;
        // set value for input slider

        $('#users').slider('setValue', $scope.script.number_threads);
        $('#ramup').slider('setValue', $scope.script.ram_up);
        $('#loops').slider('setValue', $scope.script.loops);
        $('#engines').slider('setValue', $scope.script.number_engines);
      });

      $scope.delete = function() {

        $.SmartMessageBox({
            title: $rootScope.getWord("Delete script"),
            content: $rootScope.getWord("Are you sure to delete the script?"),
            buttons: $rootScope.getWord('[No][Yes]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes" || ButtonPressed ==="はい") {

              ScriptService.delete($scope.projectId, $scope.scriptId, function (data, status) {
                if (status == 202) {
                  $.smallBox({
                    title: $rootScope.getWord("The script has deleted"),
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                    color: "#296191",
                    iconSmall: "fa fa-check bounce animated",
                    timeout: 4000
                  });

                  $state.go("app.performance.scripts", { id : $scope.projectId });
                }
              });
            }
            if (ButtonPressed === "No") {
               return;
            }
        });

      }

      $scope.update = function() {
        ScriptService.update($scope.projectId, $scope.script, function (data, status) {
        switch (status) {
          case 202 : 
            $.smallBox({
              title: $rootScope.getWord("The script has updated"),
              content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
              color: "#296191",
              iconSmall: "fa fa-check bounce animated",
              timeout: 4000
            });

            $state.go('app.performance.scripts', { id: $scope.projectId });

            break;
          case 204 :
            $.smallBox({
              title: $rootScope.getWord("The script has nothing to update"),
              content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
              color: "#296191",
              iconSmall: "fa fa-check bounce animated",
              timeout: 4000
            });
            break;
          case 400 :
            $.smallBox({
              title: $rootScope.getWord("The script is not exist"),
              content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
              color: "#296191",
              iconSmall: "fa fa-check bounce animated",
              timeout: 4000
            });
            break;
          default:
            break;
        }
      });
      }

      $scope.aceLoaded = function(editor) {
        editor.setFontSize(14);
        editor.getSession().setFoldStyle('markbeginend');
      }

      $scope.files = [];
      $scope.progressPercentage = [];
      console.log($scope.progressPercentage);

      $scope.$watch('files', function() {

        if ($scope.files === undefined || $scope.files === null) return;

        for (var i = 0; i < $scope.files.length; i++) {
          var file = $scope.files[i];
          Upload.upload({
            url: appConfig.RestEntry + '/api/v1/project/performance/' + $scope.scriptId + '/csv/upload',
            data: {file: file},
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'X-SPACE': $cookies.get('space')
            }
          }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
            console.log('Error status ' + resp.status);
          }, function (evt) {
            console.log(evt.loaded)
            console.log(evt.total);

            _.forEach($scope.progressPercentage, function (val) {
              if (val.fileName === evt.config.data.file.name) {
                val.percent = parseInt(100.0 * evt.loaded / evt.total);
              }
            });

            var existed = _.find($scope.progressPercentage, function (val) {
              return val.fileName === evt.config.data.file.name;
            })

            if (existed === undefined || existed === null) {
              $scope.progressPercentage.push({
                'fileName': evt.config.data.file.name,
                'percent': parseInt(100.0 * evt.loaded / evt.total)
              });  
            }
            
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
          });
        }
      })

    }]);
});