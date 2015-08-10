define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$stateParams', '$state', '$templateRequest', '$compile', 'PerformanceService', 
    function($scope, $stateParams, $state, $templateRequest, $compile, PerformanceService) {

    	$scope.projectId = $stateParams.id;
      $scope.title = 'OVERVIEWS'
      PerformanceService.get($scope.projectId, function(response) {
        $scope.project = response;

        if (response.jobs != null) {
          var jobs = JSON.parse(response.jobs);
          $scope.project.jobs = jobs;
        }
      });

      $scope.openJobReport = function (jobId) {
        $state.go('app.performance.report', {jobId : jobId});
      }
      
      var loadModal = function() {
        var $modal = $('#project-log');

        //clear modal content
        $modal.html('');

        $templateRequest('app/performance/views/overview-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      };

      $scope.viewLog = function() {
        loadModal();
      }

  	}]);
});