define(['performance/module', 'notification'], function (module) {
  
  'use strict';

  module.registerController('NewScriptCtrl', ['$scope', '$stateParams', 'PerformanceService', function($scope, $stateParams, PerformanceService) {

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

      };

      var $upload_name = $('.upload_name');
      var $fileNames = $('input[name="listFile"]');

      //validation for file name
      $upload_name.on('keypress', function () {
        if ($(this).val().trim() != '') {
          $(this).parent().removeClass('has-error');
        }
      });

      // validation for script name
      $fileNames.on('keypress', function () {
        if ($(this).val().trim() != '') {
          $(this).removeClass('state-error');
        }
      });

      // click save after upload file
      $scope.saveUploadedScripts = function () {

        // check fields are not null
        if ($upload_name.val().trim() == '' || $fileNames.val() =='' ) {
          if ($upload_name.val().trim() == '' && $fileNames.val() =='' ) {
            $upload_name.parent().addClass('has-error');
            $fileNames.addClass('state-error');
          } else if ($fileNames.val() =='') {
            $fileNames.addClass('state-error');
            $fileNames.focus();
          } else {
            $upload_name.parent().addClass('has-error');
            $upload_name.focus();
          } 
        } else { // all fields are filled 
          $('#uploadScript').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();

          PerformanceService.createPerformanceTestByUpload($scope.file, $upload_name.val(), $stateParams.id , function (data,status) {
            console.log(data);
            if (data != null) {
              $.smallBox({
                title: "The script has created",
                content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
                color: "#5F895F",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });

              _.forEach(data, function (script) {
                $scope.project.scripts.push(script);
                $scope.project.totalScripts += data.length;
              });
            }
          });
        }
      }
  }]);

});