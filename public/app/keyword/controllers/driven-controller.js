define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('DrivenCtrl', [
    '$scope', '$stateParams', '$templateRequest', '$compile', 'CaseService',
    function($scope, $stateParams, $templateRequest, $compile, CaseService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'DATA DRIVEN';

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
      });

      var loadModal = function() {
        var $modal = $('#add-datadriven');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/datadriven-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });
      };

      $scope.clickToCase = function(caze) {
        $scope.current = caze;
        loadModal();
      };



    }]);
});