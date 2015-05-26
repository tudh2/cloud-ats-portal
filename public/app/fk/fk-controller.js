define(['fk/module'], function(module) {
  
  'use strict';

  module.registerController('FKCtrl', ['$rootScope', '$scope', 'UserService', 'DataService',
    function($rootScope, $scope, userService, dataService) {

    $scope.list = true;

    userService.spaces().then(function(spaces) {
      $scope.spaces = spaces;
    });

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

    $scope.fkWizardStepCallback = function(step, wizardData) {
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
    }
  }]);
})