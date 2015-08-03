define(['performance/module', 'notification'], function (module) {
  
  'use strict';

  module.registerController('PerformanceExeCtrl', ['$scope', '$stateParams', 'ScriptService', 'PerformanceService', function($scope, $stateParams, ScriptService, PerformanceService) {
 
 		$scope.projectId = $stateParams.id;

 		$scope.title = "EXECUTION";
    ScriptService.list($scope.projectId, function(response) {
      $scope.scripts = response;
      $scope.totalScripts = response.totalScripts;
    });

    // add 'check' class when script is checked
    $scope.check = function ($event) {
      var element = $event.currentTarget;

      $(element).toggleClass('checked');
    };

    //run project with projectid and list scripts
    $scope.runPerformanceTest = function () {

      var $listCheckedScript = $('.scriptId').find('.checked');

      var scriptIds = [];
      _.forEach($listCheckedScript, function (item) {
        var idObject = {};
        idObject._id = $(item).val();
        scriptIds.push(idObject);
      });

      PerformanceService.run($stateParams.id, scriptIds, function(data, status) {
        if (data != null) {
          $.smallBox({
            title: "The test is running",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#5F895F",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });
        }
      });
    }
  }]);
});