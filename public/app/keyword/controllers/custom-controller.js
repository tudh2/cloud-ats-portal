define(['keyword/module'], function (module) {

  'use strict';

  module.registerController('CustomCtrl', [
    '$scope', '$state', '$stateParams', '$templateRequest', '$compile', 
    function($scope, $state, $stateParams, $templateRequest, $compile) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'CUSTOM KEYWORDS';

      $scope.backToCaseList = function() {
        $state.go('app.keyword.cases', {id : $scope.projectId});
      }

  }]);

});