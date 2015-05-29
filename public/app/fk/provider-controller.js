define(['fk/module'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {


  		$scope.list = true;
      $scope.spacename = 'Public';

  		UserService.spaces().then(function(spaces) {
        $scope.spaces = spaces;
      });
      $scope.data = {};
      var tenant = $rootScope.context.tenant._id;

      DataService.list(tenant, null).then(function (response) {
        $scope.delete = false;
        $scope.data = response;
      });
      $scope.getDateSetName = function (space) {

        if (space == null) {
          $scope.data = '';
        }
        DataService.list(tenant, space).then(function (response){
          $scope.delete = false;
          $scope.data = response;
        });
      }

      $scope.getDataSet = function (dataSetId) {
        DataService.dataSet(dataSetId).then(function (response) {
         // $scope.dataCurrent = JSON.parse(response.data.data_source);

        });
      }

      $scope.deleteDataSet = function (dataSetId) {
        DataService.deleteDataSetById(dataSetId);

      }

    }]);
})