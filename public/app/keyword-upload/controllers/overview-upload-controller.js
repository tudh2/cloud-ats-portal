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
      KeywordUploadService.get($scope.projectId, function (data,status) {
        if(status === 404)
          $state.go('app.projects');
        $scope.project = data;
        if($scope.project.lastJobId) {
          getListReport($scope.project._id);
        }
      });

      var getListReport = function(projectId) {
        KeywordUploadService.getListReport(projectId,function (data,status) {
          $scope.listLogs = data;
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

      $scope.viewLogWithJobId = function(jobId) {
        KeywordUploadService.getReport($scope.projectId, jobId, function (data,status) {
          if(data.log) {
            $scope.project.log = data.log;
            loadModal();
          }
        });
        
      }

      $scope.run = function() {

        $scope.project.status = "RUNNING";
        $scope.project.log = undefined;
        $scope.project.watchUrl = undefined

        KeywordUploadService.run($scope.projectId, function (data, status) {
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

            if(job.project_status === 'READY') {
              var log = {
                created_date : undefined,  
                jobId: undefined,
                log: undefined,
                result: undefined
              };
              KeywordUploadService.getReport($scope.projectId, job._id, function (data, status) {
                if(status === 404) return;
                log.created_date = data.created_date;
                log.jobId = data.jobId;
                log.log = data.log;
                log.result = data.result;
                $scope.listLogs.unshift(log);
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('The job ') + job._id + $rootScope.getWord(' has completed.'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
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

          var fileName = $scope.file.name;
          var lastIndex = _.lastIndexOf(fileName, ".");
          var extension = fileName.substring(lastIndex + 1);
          if(extension !== "zip") {
            $.smallBox({
              title: $rootScope.getWord('Notification'),
              content: $rootScope.getWord('File is not correct format !'),
              color: '#C00000 ',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            $('#uploadFile').val('');
            $scope.file = undefined;
            return;
          }

          KeywordUploadService.upload(projectId,$scope.file,function(data,status){
            if(status === 201) {
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Upload success !'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $("#uploadCode").modal('hide');
            } else {
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('File is not correct format !'),
                color: '#C00000 ',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $('#uploadFile').val('');
              $scope.file = undefined;
            }
          });
        }
      }


      EventService.feed(updateStatus);

  }]);
});