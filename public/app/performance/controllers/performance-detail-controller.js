define(['performance/module'], function (module) {
  'use strict';

  module.registerController('PerformanceDetailCtrl', 
    ['$scope', '$stateParams','PerformanceService', 
    function($scope, $stateParams, PerformanceService) {

      PerformanceService.get($stateParams.id, function(response) {
        $scope.project = response;
      });
  }]);
});