define(['fk/module', 'notification'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {

  		$scope.list = true;
      $scope.selected = undefined;
      $scope.selectedDataSet = [];

      $rootScope.$watch('context', function(newContext) {
        var tenant = newContext.tenant._id;
        var space = newContext.space;
        if (space === undefined) {
          space = {_id: null};
        }
        loadDataList(tenant, space);
      });

      var loadDataList = function (tenant, space) {
        DataService.list(tenant, space._id).then(function (response){
          $scope.data = response;
          if (response.length > 0) {
            $scope.selected = response[0];
          }
        });
      };

      var tenant = $rootScope.context.tenant._id;
      var space = $rootScope.context.space;
      if (space === undefined) {
        space = {_id: null};
      }
      loadDataList(tenant, space);

      $scope.$watch('selected', function(newValue) {
        updateCurrentDataSet();
      });

      $scope.select = function(driven) {
        $scope.selected = driven;
        $scope.selected.editable = false;
      }

      var updateCurrentDataSet = function() {
        if ($scope.selected === undefined) return [];
        $scope.selectedDataSet = JSON.parse($scope.selected.data_source);
      }

      $scope.deleteDataSet = function (data) {
        $.SmartMessageBox({
          title: "Data Driven",
          content: "Are you sure to delete '" + data.name + "'?",
          buttons: '[No][Yes]'
        }, function(ButtonPressed) {
          if (ButtonPressed === "Yes") {
            DataService.deleteDataSetById(data._id, function (response) {
              _.remove($scope.data, function(driven) {
                return driven._id == data._id;
              });
              if ($scope.data.length > 0) {
                $scope.selected = $scope.data[0];
              }
            });
          }
        });
      }

      $scope.createDataSet = function() {
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

        DataService.create(name, dataset, function(data, status) {
          if (status == 200) {
            $scope.data.push(data);
            $scope.list = true;
            $scope.selected = data;
          }
        });
      };

      $scope.saveUpdateDataSet = function () {
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

        var name = $('div.smart-form input[name="driven-name"]').val();
        DataService.update($scope.selected._id, name, dataset, function(data, status) {
          
          $scope.selected = data;
          var index = _.findIndex($scope.data, function(driven) {
            return driven._id == data._id;
          });
          $scope.data[index] = data;

          $.smallBox({
            title: "Data Driven",
            content: "<i class='fa fa-clock-o'></i> <i>Your data driven has updated.</i>",
            color: "#659265",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
        });
      }

      $scope.cancelUpdateDataSet = function () {
        $scope.selected.editable = false;
      }

    }]);
})