define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';

  module.registerController('TestcaseReportCtrl', ['$scope', 'KeywordService', '$stateParams',
   function ($scope , KeywordService, $stateParams) {
    $scope.projectId = $stateParams.id;
    $scope.jobId = $stateParams.jobId;
    $scope.caseReportId = $stateParams.caseReportId;
    $scope.caseName = '' ;
    $scope.dataSource = [];
    $scope.listStep = [] ;
    $scope.listParams = [];

    KeywordService.getReportCase($scope.projectId, $scope.jobId, $scope.caseReportId, function(data) {
          
          $scope.caseName = data.caseName;
          $scope.dataSource = JSON.parse(data.dataSource);
          $scope.listStep = data.listStep;

          console.log($scope.listStep);
          if ($scope.dataSource.length == 0) {
          } else {
          }
      });

  }]);


});