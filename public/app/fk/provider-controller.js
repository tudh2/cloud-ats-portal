define(['fk/module'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {


  		$scope.list = true;
      $scope.space = 'Public';
      $scope.chooseSpace = 'Public';
      $scope.updatedNothing = false;
      $scope.updateDataId = null;
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

      $scope.setSpace = function (space) {
        $scope.chooseSpace = space;
      }

      $scope.getDataSet = function (provider) {
          $scope.showDetailDataset = $scope.showDetailDataset === false ? true: false;
          $scope.clickItem = provider;
          var dataset = JSON.parse(provider.data_source);
          $scope.currentDataSet = dataset;
          $scope.updatedNothing = false;
          $scope.updateDataId = provider._id;
      }

      $scope.showItemChoosed = function(provider,showDetailDataset) {

        $scope.showDetailDataset = showDetailDataset === true ? false: true;
        $scope.provider = provider;
        return angular.equals($scope.provider, $scope.clickItem);
      }

      $scope.deleteDataSet = function (dataSetId) {

        DataService.deleteDataSetById(dataSetId, function (response) {
          $scope.clickItem = false;
        });

      }

      $scope.cancelCreateDataProvider = function () {
        $scope.list = true;
        $scope.updatedNothing = false;
        $scope.clickItem = false;
      }

      $scope.newdata = function () {

        $scope.list = false;
        $scope.chooseSpace = 'Public';
      }

      $scope.createDataProvider = function() {
        var name = $('div.data-provider form input[name="provider_name"]').val();
        if (name === undefined || name === '') return;

        var fieldNames = [];
        $('div.data-provider table thead th.filedName').each(function(index, obj) {
          var fieldName = $(obj).text().trim();
          fieldNames[index] = fieldName;
        });

        var rows = [];
        $('div.data-provider table tbody tr.fieldValues').each(function(index, tr) {
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

        DataService.create(name, spaceId, dataset, function(data, status) {
          if (status == 200) {
            $scope.getDateSetName(spaceId);
            $scope.cancelCreateDataProvider();
            
            var space = $('.col.col-md-4.form-group.listSpaceNew select').select2('data').text;
            $('.form-group.listspace div a.select2-choice span.select2-chosen').text(space);
          }
        });
      };

      $scope.UpdateDataProvider = function () {

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

        DataService.update($scope.updateDataId, dataset, function(data, status) {
          
          _.forEach($scope.data, function (data) {

            if (data._id === $scope.updateDataId) {
              data.data_source = JSON.stringify(dataset);
            }
          });

        });
      }

      $scope.CancelUpdateDataProvider = function () {
        $scope.showDetailDataset = false;
        $scope.clickItem = false;
      }

    }]);
})