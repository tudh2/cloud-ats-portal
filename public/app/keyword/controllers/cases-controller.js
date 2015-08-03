define(['keyword/module'], function (module) {

  'use strict';

  module.registerController('CasesCtrl', [
    '$scope', '$stateParams', 'CaseService', 
    function($scope, $stateParams, CaseService) {

      console.log($stateParams);
      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST CASES';

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
        $scope.cases.push(
          {
            "name": "Test Case 1",
            "steps": [],
            "info":""
          }
        )
      });

  }]);

});