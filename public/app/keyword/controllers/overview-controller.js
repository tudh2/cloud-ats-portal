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

      $scope.query = {
        'current': 1,
        'total': 0
      };

      $scope.delay = {
        value:0
      };
      
      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
        if($scope.project.lastJobId) {
          getListReport($scope.project._id, 1);
        }
      });

      var getListReport = function(projectId, index) {

        KeywordService.getListReport(projectId, index, function(dataRes,status) {
          if (dataRes.length) {
            $scope.query.total = dataRes[0].total;
          }
          _.forEach(dataRes, function (obj) {
            if (obj.numberFailedSuite > 0) {
              obj.test_result = 'Fail';
            } else obj.test_result = 'Pass';
          });
          $scope.listReports = dataRes;
        });
      }

      $scope.$watch('query.current', function (newPage, oldPage) {
        if($scope.project) {
          getListReport($scope.project._id, newPage);
        }
      });

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

        KeywordService.log($scope.project._id, function (data, status) {
          if (status == 200) {
            $scope.project.log = data;
          }
          loadModal();
        });
      }

      $scope.runLastSuites = function() {

        var selected = [];
        _.forEach($scope.project.lastSuites, function(sel) {
          selected.push(sel._id);
        });

        var options = {};
        KeywordService.run($scope.projectId, selected, options, function (data, status) {
          switch (status) {
            case 201:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $scope.project.status = "RUNNING";
              $scope.project.log = undefined;
              $scope.project.watchUrl = undefined
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

      $scope.stopProject = function (projectId) {
        KeywordService.stop(projectId, function (data, status) {
          if (status == 200) {
            $.smallBox({
              title: $rootScope.getWord('Notification'),
              content: $rootScope.getWord('Your project has been already stopped'),
              color: '#296191',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            $scope.project.status = 'READY';
          }

        });
      }

      var loadEditModal = function () {
        var $modal = $('#project-edittion');

        $modal.html('');
        $templateRequest('app/keyword/views/project-edittion-modal-content.tpl.html').then(function (template) {

          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      }

      $scope.edit = function () {
        loadEditModal();
        $scope.newName = angular.copy($scope.project.name);
        $scope.delay.value = angular.copy($scope.project.value_delay);
      }

      $scope.$watch('delay.value', function(newValue) {
        var delayParentEle = $("div#project-edittion input[name='delay']").parent();
        if($scope.delay.value !== undefined) {
          delayParentEle.removeClass('has-error');
        } else {
          delayParentEle.addClass('has-error');
        }
      })

      $scope.update = function (name) {
        
        var $modal = $('#project-edittion');
        var delayParentEle = $("div#project-edittion input[name='delay']").parent();

        if ($scope.delay.value === undefined) {
          delayParentEle.addClass('has-error');
          delayParentEle.focus();
          return;
        }

        if (!$scope.newName) {

          $modal.find('.form-group').addClass('has-error');
          $modal.find('.form-group').children().first().focus();
          return;
        }

        var valueDelay = $scope.delay.value;
        KeywordService.update($scope.projectId, name, valueDelay, function (data, status) {

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
              $scope.project.value_delay = valueDelay;
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

              KeywordService.delete($scope.projectId, function (data, status) {
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

      $scope.downloadResult = function(projectId,jobId) {
        KeywordService.download(projectId, jobId ,function (data,status) {
          var file = new Blob([data], {type: 'application/x-gzip'});
          var link=document.createElement('a');
          link.href=window.URL.createObjectURL(file);
          link.download="final-result.tar.gz";
          link.click();
        });
      }

      var updateStatus = function(msg) {
        $scope.$apply(function() {
          var job = JSON.parse(msg.data);
          if (job.project_id === $scope.projectId) {
            $scope.project.status = job.project_status;
            $scope.project.watchUrl = job.watch_url;
            $scope.project.log = job.log;
            $scope.project.isBuilding = job.isBuilding;
            if (job.project_status === 'READY') {

              var report = { 
                  created_date : undefined,  
                  job_id: undefined,
                  numberPassedSuite : 0,
                  numberFailedSuite : 0,
                  duration: 0 
              };
            	KeywordService.updateStatus($scope.projectId, job._id, function (data, status) {
                if(status === 404) return;
                $scope.project.lastRunning = data.created_date;
                report.created_date = data.created_date;
                report.jobId = data.jobId;
                report.duration = data.duration;
                report.stt = 1;
                report.numberPassedSuite = data.numberPassedSuite;
                report.numberFailedSuite = data.numberFailedSuite;

                if (report.numberFailedSuite) {
                  report.test_result = 'Fail';
                } else report.test_result = 'Pass';

                if ($scope.listReports.length === 10) {
                  $scope.listReports.pop();
                }
                
                _.forEach($scope.listReports, function (iter) {
                  iter.stt = iter.stt + 1;
                });

                $scope.listReports.unshift(report);

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

      EventService.feed(updateStatus);

  }]);
});