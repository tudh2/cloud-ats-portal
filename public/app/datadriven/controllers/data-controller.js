define(['datadriven/module', 'notification'], function(module) {
  
  'use strict';
  module.registerController('DataCtrl',['$rootScope', '$state', '$scope', '$templateRequest', '$compile', 'CaseService', 'UserService', 'DataService', 
  	function ($rootScope, $state, $scope, $templateRequest, $compile, CaseService, UserService, DataService) {

      $scope.current = undefined;
      $scope.dataset = [];
      $scope.editable = false;
      $scope.create = false;
      $scope.datas = [];

      DataService.list(function (data, status) {
        $scope.datas = data;
        if ($scope.datas.length > 0) {
          $scope.current = $scope.datas[0];
          $scope.dataset = JSON.parse($scope.current.data_source);
        } else {
          $('.data-provider').find('.driven-name').hide();
          $('.data-provider').find('.edit-button').hide();
        }
      });

      var loadDataset = function (id) {
        DataService.get(id).then(function (response) {
          $scope.dataset = JSON.parse(response.data.data_source);
        });
      }

      $scope.chooseData = function (data) {
        $scope.editable = false;
        $scope.create = false;
        $scope.current = data;
        $scope.dataset = JSON.parse(data.data_source);
        $scope.datasetname = data.name;
      }

      $scope.clickNewDataDrivenButton = function ($event) {
       /* $('.data-provider').show();
        $('.data-provider').find('.driven-name').show();
        $scope.dataset = [];
        $scope.current = undefined;
        $scope.editable = true;
        $scope.create = true;*/
        var $element = $('#data-table');
        $element.html('');

        $templateRequest('app/datadriven/views/data-driven.tpl.html').then(function(template) {
          $element.html($compile(template)($scope));
        });
        $scope.dataset = [];
        $scope.current = undefined;
        $scope.editable = true;
        $scope.create = true;
      }

      $scope.editDataset = function () {
        $scope.currentDataset = angular.copy($scope.dataset);
        $scope.editable = true;
      }

      $scope.cancelEdit = function () {
        $scope.editable = false;
        if ($scope.current === undefined) {
          if ($scope.datas.length > 0) {
            $scope.current = $scope.datas[0];
            $scope.dataset = JSON.parse($scope.current.data_source);
            $scope.editable = false;
            $scope.create = false;
          } else {
            $scope.current = undefined;
            $scope.dataset = [];
            $('.data-provider').hide();
          }
        } else {
          $scope.dataset = $scope.currentDataset;
          $scope.editable = false;
        }
      }

      $scope.updateDataDriven = function () {
        if ($scope.current.name === undefined || $scope.current.name === '') return;
        var fieldNames = [];
        $('.data-provider table thead th.filedName').each(function(index, obj) {
          var fieldName = $(obj).text().trim();
          fieldNames[index] = fieldName;
        });

        var rows = [];
        $('.data-provider table tbody tr.fieldValues').each(function(index, tr) {
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

        DataService.update($scope.current.name, dataset, $scope.current._id, function(data, status) {
          
          if (status == 200) {
            $scope.create = false;
            $scope.editable = false;
            $.smallBox({
              title: "Data Driven",
              content: "<i class='fa fa-clock-o'></i> <i>Your data driven has updated.</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            $scope.dataset = JSON.parse(data.data_source);
            $scope.current.data_source = data.data_source;
          }
          if (status == 304) {
            $scope.create = false;
            $scope.editable = false;
            $.smallBox({
              title: "Data Driven",
              content: "<i class='fa fa-clock-o'></i> <i>Your data driven has nothing to update.</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
          }
        });
      }

      $scope.createDataDriven = function () {

        if ($scope.current.name === undefined || $scope.current.name === '') return;

        var fieldNames = [];
        $('.data-provider table thead th.filedName').each(function(index, obj) {
          var fieldName = $(obj).text().trim();
          fieldNames[index] = fieldName;
        });

        var rows = [];
        $('.data-provider table tbody tr.fieldValues').each(function(index, tr) {
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

        DataService.create($scope.current.name, dataset, 'null', function(data, status) {
          if (status == 200) {
            $scope.create = false;
            $scope.editable = false;
            $.smallBox({
              title: "Data Driven",
              content: "<i class='fa fa-clock-o'></i> <i>Your data driven has created.</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });

            $scope.datas.push(data);
            $scope.current = data;
            $scope.dataset = JSON.parse(data.data_source);
          }
        });
      }

      $scope.deleteDataDriven = function (data, index) {
        $.SmartMessageBox({
            title: "Delete data driven",
            content: "Are you sure to delete the data driven",
            buttons: '[No][Yes]'
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
              DataService.delete($scope.current._id, function (data, status) {
                if (status === 200) {
                  $.smallBox({
                    title: "Data Driven",
                    content: "<i class='fa fa-clock-o'></i> <i>Your data driven has deleted</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
                  });
                  $scope.datas.splice(index, 1);
                  $scope.dataset = [];
                  if ($scope.datas.length > 0) {
                    $scope.current = $scope.datas[0];
                    $scope.dataset = JSON.parse($scope.current.data_source);
                  } else {
                    $scope.current = undefined;
                    $scope.dataset = [];
                    $('.data-provider').hide();
                  }
                }
              });
            }
            if (ButtonPressed === "No") {
               return;
            }
        });
      }
    }]);
})