define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';

  module.registerController('TestcaseReportCtrl', ['$scope', 'KeywordService', '$stateParams',
   function ($scope , KeywordService, $stateParams) {
    $scope.projectId = $stateParams.id;
    $scope.jobId = $stateParams.jobId;
    $scope.caseReportId = $stateParams.caseReportId;
    $scope.case = '';
    $scope.listStep = [];

    KeywordService.getReportCase($scope.projectId, $scope.jobId, $scope.caseReportId, function(data) {
          $scope.case = JSON.parse(data.case);
          $scope.listStep = data.listStep;
      });

  }]);
});