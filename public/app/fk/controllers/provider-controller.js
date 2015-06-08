define(['fk/module', 'notification'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {

  		$scope.list = true;
      $scope.space = 'Public';
      $scope.updatedDataAlert = false;
      $scope.updateDataId = null;
      $scope.showDetailDataset = false;

  		UserService.spaces().then(function(spaces) {
        $scope.spaces = spaces;
      });

      $scope.data = {};
      var tenant = $rootScope.context.tenant._id;

      DataService.list(tenant, null).then(function (response) {
        $scope.delete = false;
        $scope.data = response;
      });
      $scope.getDataSetName = function (space) {
        $scope.space = space;
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
        $scope.space = space;
      }

      $scope.getDataSet = function (provider) {
          $scope.showDetailDataset = $scope.showDetailDataset === false ? true: false;
          $scope.clickItem = provider;
          var dataset = JSON.parse(provider.data_source);
          $scope.currentDataSet = dataset;
          $scope.updatedDataAlert = false;
          $scope.updateDataId = provider._id;
      }

      $scope.showItemChose = function(provider,showDetailDataset) {

        $scope.showDetailDataset = showDetailDataset === true ? false: true;
        $scope.provider = provider;
        return angular.equals($scope.provider, $scope.clickItem);
      }

      $scope.deleteDataSet = function ($event, data) {
        var element = $event.currentTarget;

        $.SmartMessageBox({
          title: "Data Driven",
          content: "Are you sure to delete '" + data.name + "'?",
          buttons: '[No][Yes]'
        }, function(ButtonPressed) {
          if (ButtonPressed === "Yes") {
            DataService.deleteDataSetById(data._id, function (response) {
              $scope.clickItem = false;
              $(element).parent().remove();
            });
          }
        });

      }

      $scope.cancelCreateDataProvider = function () {
        $scope.list = true;
        $scope.updatedDataAlert = false;
        $scope.clickItem = false;
      }

      $scope.newdata = function () {
        $scope.list = false;
        $scope.space = 'Public';
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

        var spaceId = $scope.space;
        
        if (spaceId === 'Public') {
          spaceId = null;
        }

        DataService.create(name, spaceId, dataset, function(data, status) {
          if (status == 200) {
            $scope.getDataSetName(spaceId);
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
          $scope.updatedDataAlert = true;

        });
      }

      $scope.CancelUpdateDataProvider = function () {
        $scope.showDetailDataset = false;
        $scope.clickItem = false;
      }

    }]);
})