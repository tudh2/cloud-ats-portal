define(['projects/module'], function (module) {
  
  'use strict';

  module.registerController('NewProjectCtrl', ['$scope', '$state', 'KeywordService','KeywordUploadService', 'PerformanceService', function($scope, $state, KeywordService, KeywordUploadService, PerformanceService) {

    $scope.type = 'functional';

    $scope.functionalType = 'new';

    $scope.delay = {
      value : 0
    };

    $scope.showAction = {
      status : false
    };

    var $input =  $('div#createProject input[name="name"]');

    $input.on('keypress', function () {
      $(this).parent().removeClass('has-error');
    });

    $scope.create = function () {

      if (!$scope.name) {
        
        $input.parent().addClass('has-error');
        $input.focus();
      } else {
        $input.parent().removeClass('has-error');

        $('#createProject').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        switch ($scope.type) {
          case 'functional' :
            if($scope.functionalType === "new") {
              var showAction = $scope.showAction.status;
              var valueDelay = $scope.delay.value;
              KeywordService.create($scope.name, showAction, valueDelay, function(projectId) {
                $state.go('app.keyword', { id : projectId });
              });
            } else if($scope.functionalType === "upload"){
              KeywordUploadService.create($scope.name, function(projectId) {
                $state.go('app.keyword-upload', { id : projectId });
              });
            }
            
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