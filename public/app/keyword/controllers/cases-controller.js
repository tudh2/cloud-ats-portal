define(['keyword/module'], function (module) {

  'use strict';

  module.registerController('CasesCtrl', [
    '$scope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 
    function($scope, $stateParams, $templateRequest, $compile, CaseService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST CASES';

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
      });

      var loadModal = function() {
        var $modal = $('#editCase');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/testcase-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });
      }

      $scope.newTestCase = function() {
        $scope.current = {
          "name": "New Test Case",
          "steps": [],
          "temp": true
        };

        loadModal();        
      },

      $scope.save = function() {
        CaseService.create($scope.projectId, $scope.current, function(data) {
          $scope.cases.push(data);
          $.smallBox({
            title: 'Notification',
            content: 'Your test case have created',
            color: '#296191',
            iconSmall: 'fa fa-check fadeInRight animated',
            timeout: 3000
          });

          $('#editCase').modal('hide');
        });
      },

      $scope.clickToCase = function(caze) {
        $scope.current = caze;
        loadModal();
      } 

  }]);

});