define(['performance/module'], function (module) {
  
  'use strict';

  module.registerController('ScriptsCtrl', ['$scope', '$rootScope', '$state','$stateParams', '$templateRequest', '$compile', 'ScriptService', 
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, ScriptService) {
 	
 		$scope.projectId = $stateParams.id;

 		$scope.title = "TEST SCRIPTS";
    ScriptService.list($scope.projectId, function(response) {

      $scope.scripts = response;
      $scope.totalScripts = response.length;
    });

    $scope.aceOption = {
      mode: 'xml',
    }

    $scope.editScript = function (script) {
      if (script.raw) {
        $state.go('app.performance.scripts.editor', { scriptId : script._id });
      } else {
        $state.go('app.performance.scripts.wizard', { scriptId : script._id });
      }
    }

    $scope.clickUploadScriptButton = function () {
      var $modal = $('#uploadScript');
      $templateRequest('app/performance/views/upload-script.tpl.html').then(function (template) {
        $modal.html($compile(template)($scope));
      });
    };

    $scope.aceLoaded = function(editor) {
      editor.setFontSize(14);
      editor.getSession().setFoldStyle('markbeginend');
    }

    $scope.updateFile = function(element) {
      $scope.file = element.files[0];
    }
    
    // click save after upload file
    $scope.saveUploadedScripts = function () {
      $('#uploadScript').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();

      ScriptService.createScriptTestByUpload($scope.file, $scope.name, $stateParams.id , function (script,status) {
        if (script != null) {
          $.smallBox({
            title: $rootScope.getWord("The script has created"),
            content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
            color: "#296191",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });

          //inherit from ScriptsController
          $scope.scripts.push(script);
          $scope.totalScripts++;

          $scope.file = undefined;
          $scope.name = undefined;
        }
      });
    }

  }]);
});