define(['projects/module'], function (module) {
  
  'use strict';

  module.registerController('NewProjectCtrl', ['$scope', '$state', 'KeywordService', 'PerformanceService', function($scope, $state, KeywordService, PerformanceService) {

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
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        switch ($scope.type) {
          case 'functional' :
            KeywordService.create($scope.name, function(projectId) {
              $state.go('app.keyword', { id : projectId });
            });
            break;
          case 'performance' :
            PerformanceService.create($scope.name, function (response) {
              $state.go('app.performance', {id: response});
            });
            break;
          default:
            break;
        }

      }
    }
  }]);

});