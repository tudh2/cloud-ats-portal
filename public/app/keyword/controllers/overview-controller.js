define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('OverviewCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies', 'KeywordService', 'EventService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordService, EventService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS';
      
      $scope.suiteReports = [];

      $scope.dataReports = [];

      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
      });

       if($scope.jobId) {
        
        KeywordService.getReport($scope.projectId, $scope.jobId, function(data,status) {
          getDataReport(data);
        });
      }

      var getDataReport = function(data) {

        for(var i = 0; i < data.length; i++) {
          var obj;
          var nameSuite;
          var suiteReport = data[i].suite_reports;

          _.forEach(suiteReport,function(n,key) {
              obj = n;
              nameSuite = key;
          })

          var dataReport = {
            x : nameSuite,
            P : obj.total_pass,
            F : obj.total_fail,
            S : obj.total_skip
          }

          if(obj.test_result) {
            obj.test_result = 'Pass'
          } else {
            obj.test_result = 'Fail'
          }

          obj.running_time = obj.running_time.$date;

          $scope.suiteReports.push(obj);
          $scope.dataReports.push(dataReport);

          draw($scope.dataReports);
        }
      };

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

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        EventService.close();
      });
  }]);
});