define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$rootScope', '$stateParams', '$state', '$templateRequest', '$compile', 'PerformanceService', 'EventService',
    function($scope, $rootScope, $stateParams, $state, $templateRequest, $compile, PerformanceService, EventService) {

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

      $scope.runLastScripts = function () {
        $scope.project.status = "RUNNING";
        $scope.project.log = undefined;

        var selected = [];
        _.forEach($scope.project.lastScripts, function(sel) {
          selected.push(sel._id);
        });

        PerformanceService.run($scope.projectId, selected, function (data, status) {
          switch (status) {
            case 200:
              $.smallBox({
                title: 'Notification',
                content: 'You have submitted project job',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: 'Notification',
                content: 'Your project has been already running',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: 'Notification',
                content: 'Can not submmit your project job',
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });
          }
          $scope.project.jobs.unshift(data);
        });
      }

      var updateStatus = function(msg) {
        $scope.$apply(function() {
          var job = JSON.parse(msg.data);
          if (job.project_id === $scope.projectId) {
            $scope.project.status = job.project_status;
            $scope.project.log = job.log;
            switch (job.status) {
              case 'Running': 
                var currentJob = _.find($scope.project.jobs, function (obj) {
                  return job._id === obj._id;
                });
                currentJob.status = 'Running';
                break;
              case 'Completed':
                var currentJob = _.find($scope.project.jobs, function (obj) {
                  return job._id === obj._id;
                });
                currentJob.status = 'Completed';
                break;
              default:
                break;
            }

            if ($scope.project.status === 'READY') {
              $.smallBox({
                title: 'Notification',
                content: 'The job ' + job._id + ' has completed.',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
            }
          }
        })
      }

      EventService.feed(updateStatus);

  	}]);
});