define(['fk/module', 'lodash'], function(module, _) {
  'use strict';

  module.registerDirective('drivenSelector', ['$rootScope', 'DataService', function($rootScope, DataService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fk/directives/data-driven-selector.tpl.html',
      link: function(scope, element, attributes) {

        scope.showCreateForm = false;
        scope.selected = scope.cases[0];

        scope.buildDataset = function() {
          var dataset = [];
          var params = [];
          _.forEach(scope.selected.steps, function(step) {
            _.forEach(step.params, function(param) {
              var val = step[param];
              if (val instanceof Object) {
                val = val.value;
              }

              var startIndex = val.indexOf('${');
              var endIndex = val.lastIndexOf('}');
              if (startIndex == 0 && endIndex == (val.length - 1)) {
                var variable = val.substring(startIndex + 2, endIndex);
                params.push(variable);
              }
            });
          });

          var obj = {};
          _.forEach(params, function(param) {
            obj[param] = param + '_value';
            dataset.push(obj);
          });
          return dataset;
        };

        scope.selectCase = function(testcase) {
          scope.selected = testcase;
          scope.showCreateForm = false;
        };

        scope.showCreateFormFn = function() {
          if (scope.selected.driven) {
            if (!scope.selected.driven.isNew) {
              scope.tempDriven = scope.selected.driven;
              scope.selected.driven = undefined;
            }
          }
          scope.showCreateForm = true;
        };

        scope.destroyCreateFormFn = function() {
          if(scope.tempDriven) {
            scope.selected.driven = scope.tempDriven;
            scope.tempDriven = undefined;
          }
          scope.showCreateForm = false;
        };

        scope.chooseDataDriven = function() {
          var tenant = $rootScope.context.tenant._id;
          var space = $rootScope.context.space;
          if (space === undefined) {
            space = {_id: null};
          }
          DataService.list(tenant, space._id).then(function (data){

            var options = "";
            _.forEach(data, function(sel) {
              options += "[ name = ";
              options += sel.name;
              options += " | id = "
              options += sel._id;
              options += "]";
            });

            $.SmartMessageBox({
              title: "Data Driven: Select",
              content: "Choose your data existed",
              buttons: "[Done][Cancel]",
              input: "select",
              options: options
            }, function (ButtonPress, Value) {
              if (ButtonPress === "Done") {
                var startIndex = Value.indexOf(' | id = ') + ' | id = '.length;
                var id = Value.substring(startIndex);
                var dataset = _.find(data, function(sel) {
                  return sel._id === id;
                });
                var driven = {
                  id : dataset._id,
                  name : dataset.name,
                  data : JSON.parse(dataset.data_source)
                };
                scope.selected.driven = driven;
              }
            });
          });
        };

        scope.createNewData = function() {
          var $input = $(element).find('input[name="driven-name"]');
          var val = $input.val();
          if (!val) {
            $input.focus();
            return false;
          }

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

          scope.selected.driven = {
            name: val,
            data: dataset,
            isNew: true
          }
          scope.showCreateForm = false;
        };

        $(element).on('keypress', 'input[name="driven-name"]', function() {
          var $parent = $(this).parent();
          if ($parent.hasClass('state-error')) {
            $parent.removeClass('state-error');
            $parent.addClass('state-success');
          }
        });

        $(element).on('blur', 'input[name="driven-name"]', function() {
          var val = $(this).val();
          var $parent = $(this).parent();
          if (!val) {
            $(this).focus();
            $parent.addClass('state-error');
            $parent.removeClass('state-success');
          }
        });
      }
    }
  }]);
});