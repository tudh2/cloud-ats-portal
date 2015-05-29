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
        $scope.clickItem = false;
        if (space == null) {
          $scope.data = '';
        }
        DataService.list(tenant, space).then(function (response){
          $scope.delete = false;
          $scope.data = response;
        });
      }

      $scope.getDataSet = function (provider) {
          $scope.showDetailDataset = $scope.showDetailDataset === false ? true: false;
          $scope.clickItem = provider;
          var dataset = JSON.parse(provider.data_source);
          $scope.currentDataSet = dataset;
      }

      $scope.showItemChoosed = function(provider,showDetailDataset) {
        $scope.showDetailDataset = showDetailDataset === true ? false: true;
        $scope.provider = provider;
        return angular.equals($scope.provider, $scope.clickItem);
      }

      $scope.deleteDataSet = function (dataSetId) {
        DataService.deleteDataSetById(dataSetId);

      }

      $scope.cancelCreateDataProvider = function () {
        $scope.list = true;
      }

      $scope.newdata = function () {

        $scope.list = false;
      }

    }]);
})