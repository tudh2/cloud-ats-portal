define(['projects/module'], function (module) {
  
  'use strict';

  module.registerController('NewProjectCtrl', ['$scope', '$state', 'KeywordService','SeleniumUploadService', 'PerformanceService', function($scope, $state, KeywordService, SeleniumUploadService, PerformanceService) {

    $scope.type = 'functional';

    $scope.functionalType = 'new';

    $scope.showAction = {
      status:false
    };

    $scope.delay = {
      value:0
    };

    var $input =  $('div#createProject input[name="name"]');
    $input.on('keypress', function () {
      $(this).parent().removeClass('has-error');
    });

    $scope.$watch('delay.value', function(newValue) {
      var delayParentEle = $("div#createProject input[name='delay']").parent();
      if($scope.delay.value !== undefined) {
        delayParentEle.removeClass('has-error');
      } else {
        delayParentEle.addClass('has-error');
      }
    });

    $scope.create = function () {
      var delayParentEle = $("div#createProject input[name='delay']").parent();
      if (!$scope.name) {
        
        $input.parent().addClass('has-error');
        $input.focus();
      } else if ($scope.delay.value === undefined) {
        delayParentEle.addClass('has-error');
        delayParentEle.focus();
      } else {
        $input.parent().removeClass('has-error');
        delayParentEle.removeClass('has-error');
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
              SeleniumUploadService.create($scope.name, function(projectId) {
                $state.go('app.selenium', { id : projectId });
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