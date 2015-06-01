define(['fk/module'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {


  		$scope.list = true;
      $scope.spacename = 'Public';
      $scope.chooseSpace = 'Public';
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
        if (space === 'Public' ) {
          space = null;
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

      $scope.createDataProvider = function() {
        var name = $('form input[name="provider_name"]').val();
        if (name === undefined || name === '') return;

        var fieldNames = [];
        $('table thead th.filedName').each(function(index, obj) {
          var fieldName = $(obj).text().trim();
          fieldNames[index] = fieldName;
        });

        var rows = [];
        $('table tbody tr.fieldValues').each(function(index, tr) {
          var row = [];
          $(tr).find('td.cell').each(function(i, td) {
            row[i] = $(td).text().trim();
          });
          rows[index] = row;
        });

        var dataset = [];
        _.forEach(rows, function(row) {
          var obj = {};
          $(fieldNames).each(function(index, field) {
            obj[field] = row[index];
          });
          dataset.push(obj);
        });

        var spaceId = $scope.chooseSpace;
       
        if (spaceId === 'Public') {
          spaceId = null;
        }
        console.log(spaceId);
        DataService.create(name, spaceId, dataset, function(data, status) {
          if (status == 200) {
            $scope.getDateSetName(spaceId);
            $scope.cancelCreateDataProvider();
            if (spaceId === 'Public') {
            } else {
            }
            
          }
        });
      };

    }]);
})