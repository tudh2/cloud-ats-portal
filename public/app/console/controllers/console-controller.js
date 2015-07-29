define(['console/module'], function(module) {

  'use strict';

  module.registerController('ConsoleCtrl', ['$scope', 'ConsoleService', function($scope, ConsoleService) {

    $scope.build = function() {
      ConsoleService.build(function(data, status) {
        console.log(data);
        console.log(status);
      });
    }

  }]);


});