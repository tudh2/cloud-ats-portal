define(['projects/module'], function (module) {
  
  'use strict';

  module.registerController('NewProjectCtrl', ['$scope','KeywordService', 'PerformanceService', function($scope, KeywordService, PerformanceService) {

    $scope.type = 'functional';

    var $input =  $('div#createProject input[name="name"]');

    $input.on('keypress', function () {
      $(this).removeClass('state-error');
    });

    $scope.create = function () {

      if (!$scope.name) {
        
        $input.addClass('state-error');
        $input.focus();
      } else {
        $input.removeClass('state-error');

        $('#createProject').modal('hide');
        switch ($scope.type) {
          case 'functional' :
            KeywordService.create($scope.name, function(response) {
              console.log(response);
            });
            break;
          case 'performance' :
            PerformanceService.create($scope.name, function (response) {
              console.log(response);
            });
            break;
          default:
            break;
        }

      }
    }
  }]);

});