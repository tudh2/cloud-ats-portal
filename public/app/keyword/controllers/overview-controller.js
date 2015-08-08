define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('OverviewCtrl', 
    ['$scope', '$state', '$stateParams', 'KeywordService',
    function($scope, $state, $stateParams, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS'

      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
      });

  }]);
});