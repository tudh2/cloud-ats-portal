define(['performance/module', 'notification'], function (module) {
  
  'use strict';

  module.registerController('UploadScriptCtrl', ['$scope', '$rootScope', '$stateParams', 'ScriptService', function($scope, $rootScope, $stateParams, ScriptService) {

      $scope.file = undefined;
      // get files after files were uploaded
      $scope.uploadFile = function (element) {
        $scope.file = element.files;

        delete $scope.file.length;
        
        var fileNames = '';
        _.forEach($scope.file, function (file) {
          fileNames += file.name + ',';
        });

        $('input[name="listFile"]').val(fileNames);

        if ($('input[name="listFile"]').val(fileNames) != '') {
          $('input[name="listFile"]').parent().removeClass('has-error');
        }

      };
      
      // click save after upload file
      $scope.saveUploadedScripts = function () {
        var $fileNames = $('input[name="listFile"]');
        // check fields are not null
        if ($fileNames.val() =='' ) {
          $fileNames.parent().addClass('has-error');
          $fileNames.focus();
        } else { // all fields are filled 
          $('#uploadScript').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();

          ScriptService.createScriptTestByUpload($scope.file, $stateParams.id , function (data,status) {
            if (data != null) {
              $.smallBox({
                title: $rootScope.getWord("The script has created"),
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                color: "#296191",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });

              _.forEach(data, function (script) {
                $scope.scripts.push(script);
                $scope.totalScripts += data.length;
              });
            }
          });
        }
      }
  }]);

});