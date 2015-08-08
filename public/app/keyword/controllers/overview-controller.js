define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('OverviewCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$cookies', 'KeywordService', 'EventService',
    function($scope, $rootScope, $state, $stateParams, $cookies, KeywordService, EventService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'OVERVIEWS'

      KeywordService.get($scope.projectId, function(response) {
        $scope.project = response;
      });

      var updateStatus = function(msg) {
        $scope.$apply(function() {
          var job = JSON.parse(msg.data);
          if (job.project_id === $scope.projectId) {
            $scope.project.status = job.project_status;
          }
        })
      }

      EventService.feed(updateStatus);

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        EventService.close();
      });
  }]);
});