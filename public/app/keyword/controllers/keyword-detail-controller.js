define(['functional/module'], function (module) {
  'use strict';

  module.registerController('KeywordDetailCtrl', 
    ['$scope', '$stateParams','KeywordService', 
    function($scope, $stateParams, KeywordService) {

      KeywordService.get($stateParams.id, function(response) {
        $scope.project = response;
      });
  }]);
});