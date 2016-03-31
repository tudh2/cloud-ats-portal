define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';

  module.registerController('TestcaseReportCtrl', ['$compile', '$templateRequest', '$scope', 'KeywordService', '$stateParams',
   function ($compile, $templateRequest, $scope , KeywordService, $stateParams) {
    
    $scope.projectId = $stateParams.id;
    $scope.jobId = $stateParams.jobId;
    $scope.caseReportId = $stateParams.caseReportId;
    $scope.jobId = $stateParams.jobId;
    $scope.suiteId = $stateParams.suiteId;
    $scope.suiteReportId = $stateParams.suiteReportId;
    $scope.isShowImage = false;
    $scope.case = '';
    $scope.listStep = [];

    KeywordService.getReportCase($scope.projectId, $scope.jobId, $scope.caseReportId, function(data) {
      
      $scope.case = JSON.parse(data.case);
      if ($scope.case.data_source) {
        $scope.case.data_source = JSON.parse($scope.case.data_source);
      }
      $scope.listStep = data.listStep;
      $scope.skips = $scope.case.skipped_steps;
    });

    var loadModal = function() {
      var $modal = $('#image-case');

      //clear modal content
      $modal.html('');

      $templateRequest('app/keyword/views/failed-case-image.tpl.html').then(function(template) {
        $modal.html($compile(template)($scope));
        $modal.modal('show');
      });
    };

    $scope.showImage = function (step) {

      var name = undefined;

      if (step){
        name = step.params[0].file;
      } else name = '';
      getImage(name); 
    }

    var getImage = function (name) {
      KeywordService.showImage($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, $scope.caseReportId, name, function (data, status) {
           // Prep the response for Base64 encoding
        var uInt8Array = new Uint8Array(data);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--)
        {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');
        // Base64 encoded image and assign it to the scope
        $scope.image = window.btoa(data);
        loadModal(); 
      });
    }
  }]);
});