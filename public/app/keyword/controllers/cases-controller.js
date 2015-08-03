define(['keyword/module'], function (module) {

  'use strict';

  module.registerController('CasesCtrl', [
    '$scope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 
    function($scope, $stateParams, $templateRequest, $compile, CaseService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST CASES';

      $scope.modalReload = false;

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
      });


      $scope.newTestCase = function() {
        var $modal = $('#editCase');

        //clear modal content
        $modal.html('');

        $scope.current = {
          "name": "New Test Case",
          "steps": [],
          "temp": true
        };

        $templateRequest('app/keyword/views/testcase-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });
      },

      $scope.save = function() {
        console.log($scope.current);
      }

  }]);

});