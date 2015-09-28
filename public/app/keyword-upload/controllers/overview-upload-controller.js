define(['keyword-upload/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('OverviewUploadCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies','KeywordUploadService','EventService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordUploadService,EventService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS';
      
      $scope.suiteReports = [];

      $scope.dataReports = [];

      $scope.project = null;
      KeywordUploadService.get($scope.projectId, function(response) {
        $scope.project = response;
        if($scope.project.lastJobId) {
          getListReport($scope.project._id);
        }
      });

      var getListReport = function(projectId) {

        KeywordUploadService.getListReport(projectId,function(data,status) {
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
        $state.go('app.keyword-upload.report', {id: $scope.projectId, jobId: jobId });
      }

      var loadModal = function() {
        var $modal = $('#project-log');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword-upload/views/overview-modal-content.tpl.html').then(function(template) {
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

        KeywordUploadService.run($scope.projectId, selected, function (data, status) {
          switch (status) {
            case 201:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been already running'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not submmit your project job'),
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

          }
        });
      }

      var loadEditModal = function () {
        var $modal = $('#project-edittion');

        $modal.html('');
        $templateRequest('app/keyword-upload/views/project-edittion-modal-content.tpl.html').then(function (template) {

          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      }

      $scope.edit = function () {
        loadEditModal();
        $scope.newName = angular.copy($scope.project.name);
      }


      $scope.update = function (name) {
        
        var $modal = $('#project-edittion');
        if (!$scope.newName) {

          $modal.find('.form-group').addClass('has-error');
          $modal.find('.form-group').children().first().focus();
          return;
        }

        KeywordUploadService.update($scope.projectId, name ,function (data, status) {

          switch (status) {
            case 304:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project name does not change'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 202:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been updated'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $scope.project.name = name;
              break;
            default:
              break;
          }
          $modal.modal('hide');
        });
      }

       $scope.delete = function () {
        $.SmartMessageBox({
            title: $rootScope.getWord('Delete project'),
            content: $rootScope.getWord('Are you sure to delete the project'),
            buttons: "["+$rootScope.getWord('No')+"]["+$rootScope.getWord('Yes')+"]"
          }, function (ButtonPressed) {
            if (ButtonPressed === $rootScope.getWord('Yes')) {

              KeywordUploadService.delete($scope.projectId, function (data, status) {
                if (status === 200) {
                  $.smallBox({
                    title: $rootScope.getWord('Delete project'),
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord('The project has already deleted')+"</i>",
                    color: "#296191",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                  });

                  $state.go('app.projects');
                }
              });
            }
            if (ButtonPressed === $rootScope.getWord('No')) {
               return;
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

            if (job.project_status === 'READY') {

              var report = { 
                  created_date : undefined,  
                  job_id: undefined,
                  total_test_case : 0,
                  total_pass : 0,
                  total_fail : 0 
              };
              KeywordUploadService.getReport($scope.projectId, job._id, function (data, status) {

                report.created_date = data.created_date;
                report.job_id = data.functional_job_id;
                var suite_reports = JSON.parse(data.suite_reports);
                _.forEach(suite_reports, function (suite) {
                  report.total_test_case += suite.total_test_case;
                  report.total_pass += suite.total_pass;
                  report.total_fail += suite.total_fail;
                });

                if (report.total_fail === 0) {
                  report.test_result = 'Pass';
                } else report.test_result = 'Fail';
              });

              $scope.listReports.unshift(report);
               $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('The job ') + job._id + $rootScope.getWord(' has completed.'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
            }
          }
        })
      }

      $scope.uploadFile = function(element) {
        var $inputFile = $('input[name="chooseFile"]').parent();
        $inputFile.removeClass("has-error");
        $scope.file = element.files[0];
      }

      $scope.upload = function(projectId) {
        var $fileNames = $('input[name="listFile"]');
        if($scope.file === undefined) {
          $fileNames.parent().addClass("has-error");
        } else if($scope.file){
          $fileNames.parent().removeClass("has-error");
          KeywordUploadService.upload(projectId,$scope.file,function(data){
            if (data.error) {
              var message = data.message;
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord(message),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
            } else {
              $("#uploadCode").modal('hide');
            }
          });
        }
      }


      EventService.feed(updateStatus);

  }]);
});