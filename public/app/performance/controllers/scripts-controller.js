define(['performance/module', 'notification'], function (module) {
  
  'use strict';

  module.registerController('ScriptsCtrl', ['$scope', '$stateParams', 'ScriptService', function($scope, $stateParams, ScriptService) {
 	
 		$scope.projectId = $stateParams.id;

 		$scope.title = "TEST SCRIPTS";
    ScriptService.list($scope.projectId, function(response) {

      $scope.scripts = response;
      $scope.totalScripts = response.length;
    });
  }]);
});