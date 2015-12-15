define(['performance/module'], function (module) {
  
  'use strict';

  module.registerController('ScriptsCtrl', ['$scope', '$stateParams', 'ScriptService', function($scope, $stateParams, ScriptService) {
 	
 		$scope.projectId = $stateParams.id;

 		$scope.title = "TEST SCRIPTS";
    ScriptService.list($scope.projectId, function(response) {

      $scope.scripts = response;
      $scope.totalScripts = response.length;
    });

    $scope.aceOption = {
      mode: 'xml',
    }

    $scope.aceLoaded = function(editor) {
      editor.setFontSize(14);
      editor.getSession().setFoldStyle('markbeginend');
    }

    $scope.aceModel = 
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n';
  }]);
});