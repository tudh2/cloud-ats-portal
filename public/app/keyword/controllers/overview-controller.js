define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('OverviewCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies', 'KeywordService', 'EventService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordService, EventService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS';
      
      $scope.suiteReports = [];

      $scope.dataReports = [];

      $scope.project = null;
      
      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
        if($scope.project.lastJobId) {
          getListReport($scope.project._id);
        }
      });

      var getListReport = function(projectId) {

        KeywordService.getListReport(projectId,function(data,status) {
          $scope.listReports = [];
          _.forEach(data, function(job) {
            var report = { 
              created_date : job.created_date,  
              job_id: job.report.functional_job_id,
              total_test_case : 0,
              total_pass : 0,
              total_fail : 0 
            };
            _.forEach(job.report.suite_reports, function(suite) {
              report.total_test_case += suite.total_test_case;
              report.total_pass += suite.total_pass;
              report.total_fail += suite.total_fail;
            });

            if(report.total_fail == 0) {
              report.test_result = 'Pass';
            } else {
              report.test_result = 'Fail';
            }

            $scope.listReports.push(report);
          });
        });
      }

      $scope.redirectTo = function(jobId) {
        $state.go('app.keyword.report', {id: $scope.projectId, jobId: jobId });
      }

      var loadModal = function() {
        var $modal = $('#project-log');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/overview-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      };

      $scope.viewLog = function() {
        loadModal();
      }

      $scope.runLastSuites = function() {

        $scope.project.status = "RUNNING";
        $scope.project.log = undefined;
        $scope.project.watchUrl = undefined

        var selected = [];
        _.forEach($scope.project.lastSuites, function(sel) {
          selected.push(sel._id);
        });

        KeywordService.run($scope.projectId, selected, function (data, status) {
          switch (status) {
            case 201:
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
        });
      }

      var updateStatus = function(msg) {
        $scope.$apply(function() {
          var job = JSON.parse(msg.data);
          if (job.project_id === $scope.projectId) {
            $scope.project.status = job.project_status;
            $scope.project.watchUrl = job.watch_url;
            $scope.project.log = job.log;
          }
        })
      }

      EventService.feed(updateStatus);

  }]);
});