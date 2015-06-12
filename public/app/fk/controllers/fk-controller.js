define(['fk/module'], function(module) {
  
  'use strict';

  module.registerController('FKCtrl', ['$rootScope', '$scope', 'UserService', 'DataService',
    function($rootScope, $scope, userService, dataService) {

    $scope.list = true;
    $scope.showDetailDataset = true;
    $scope.create = true;
    $scope.showDatasetName = false;
    $scope.clickItem = false;
    $scope.selected = undefined;
    $scope.cases = [
      {
        "name": "NewCase",
        "steps": []
      }
    ];
    $scope.$watch('cases', function (newCases) {
      getParams(newCases[0]);
    });

    userService.spaces().then(function(spaces) {
      $scope.spaces = spaces;
    });

    $rootScope.$watch('context', function (newContext) {
      var space = newContext.space;
      var tenant = newContext.tenant._id;
      if (space === undefined ) {
          space = {_id: null, name: 'Public'};
      }
      $scope.spaceName = space.name;
      $scope.selected = $scope.cases[0];
      loadDataList(tenant, space);
    });

    var loadDataList = function (tenant, space) {

      dataService.list(tenant, space._id).then(function (response) {
        $scope.data = response;
        if (response.length > 0) {
          $scope.selected.editable = true;
        }
      });
    }
    
    var getParams = function (testcase) {
      $scope.selected = testcase;
      var currentDataSet = [];
      var obj = {};
      _.forEach(testcase.steps, function (object) {
        _.forEach(object.params, function (param) {
          var param = object[param];
          var text = param.substring(2, param.length -1);
          obj[text] = 'New_value';
        });
        
      });
      currentDataSet.push(obj);

      currentDataSet = JSON.stringify(currentDataSet);
      $scope.currentDataSet = JSON.parse(currentDataSet);
      $scope.selected.editable = true;
    }

    $scope.getDataset = function (testcase) {
      getParams(testcase);
    }

    $scope.chooseDataset = function (dataset) {

      if (dataset === "newDataset") {
        $scope.currentDataSet = [{'newdata': '12345'}];
        $scope.showDatasetName = false;
        $scope.datasetName = '';
        $scope.selected.editable = true;
        $scope.create = true;
      } else {

        var driven = JSON.parse(dataset);

        $scope.currentDataSet = JSON.parse(driven.data_source);

        var datasetName = $('form.create-data-provider fieldset div div.listDataset .select2-container a.select2-choice span.select2-chosen').text(); 
        $scope.showDatasetName = true;
        $scope.selected.editable = false;
        $scope.datasetName = datasetName;
        $scope.create = false;
      }
    }

    $scope.showCreateDataProviderForm = function(space) {
      var $container = $('#fk-wizard-widget div.tab-pane[data-smart-wizard-pane="2"]');
      var $title = $container.find('h3 span');
      $title.text('Create New Data Provider');
      $scope.list = false;
      $scope.dataProviderSpace = space;
    };

    $scope.cancelCreateDataProvider = function() {
      var $container = $('#fk-wizard-widget div.tab-pane[data-smart-wizard-pane="2"]');
      var $title = $container.find('h3 span');
      $title.text('Data Provider');
      $scope.list = true;
    };

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

      var spaceId = $scope.dataProviderSpace;
      dataService.create(name, spaceId, dataset, function(data, status) {
        if (status == 200) {
          var provider = {};
          provider._id = data;
          provider.name = name;
          provider.data_source = dataset;
          if (spaceId === null) {
            $scope.data.public.push(provider);
          } else {
            $scope.data[spaceId].push(provider);
          }

          $scope.cancelCreateDataProvider();
        }
      });
    };

    $scope.fkWizardCompleteCallback = function(wizardData) {
      $.smallBox({
        title: "Functional Keywords Framework",
        content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 4000
      });
    };

    /*$scope.fkWizardStepCallback = function(step, wizardData) {
      switch(step) {
        case 2:
          $scope.data = {};
          var tenant = $rootScope.context.tenant._id;

          dataService.list(tenant, null).then(function(response) {
            $scope.data.public = response;
          });

          var spaces = $scope.spaces;
          $(spaces).each(function() {
            var spaceName = this.name;
            var spaceId = this._id;
            dataService.list(tenant, spaceId).then(function(response) {
              $scope.data[spaceId] = response;
            });
          });
          break;
        default:
          break;
      }
    }*/
    var tenant = $rootScope.context.tenant._id;
    dataService.list(tenant, null).then(function (response) {
        $scope.data = response;
       // $scope.selected = response[0];
    });

    $scope.setSpace = function (space) {
      $scope.space = space;
    } 

    $scope.clickDataProviderShow = function(provider) {
      $scope.showDetailDataset = $scope.showDetailDataset === false ? true: false;
      $scope.clickItem = provider;
      if(provider.data_source instanceof Object) {
        $scope.currentDataSet = provider.data_source;
      } else {
        var dataset = JSON.parse(provider.data_source);
        $scope.currentDataSet = dataset;
      }
    }

    $scope.showItemChose = function(provider,showDetailDataset) {
      $scope.showDetailDataset = showDetailDataset === true ? false: true;
      $scope.provider = provider;
      return angular.equals($scope.provider, $scope.clickItem);
    }

  }]);
})