define(['datadriven/module', 'lodash'], function(module, _) {
  'use strict';

  return module.registerDirective('providerTable', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/datadriven/directives/data-provider-table.tpl.html',
      scope: {
        dataset: "=",
        editable: "=",
      },
      link: function(scope, element) {
        scope.editableOptions = {
          mode: 'inline',
          disabled: false
        }

        scope.count = 0;
        scope.fieldNames = [];
        scope.rows = [];

        scope.$watch('dataset', function(newdata) {
          init(newdata);
        });

        var init = function(dataset) {

          if (dataset.length == 0 && scope.editable) {
            scope.fieldNames = ['New_Field'];
            scope.rows = [['New_Value']];
            return;
          } else if (dataset.length > 0) {
            var filedNames = [];

            _.forEach(scope.dataset, function(obj) {
              _.forEach(obj, function(value, key) {
                filedNames.push(key);
              });
            });

            filedNames = _.uniq(filedNames);

            scope.fieldNames = filedNames;

            var rows = [];
            _.forEach(scope.dataset, function(obj) {
                var row = []
              _.forEach(filedNames, function(field) {
                row.push(obj[field]);
              });
              rows.push(row);
            });

            scope.rows = rows;
          }

        }

        init(scope.dataset);

        scope.removeField = function(index) {
          scope.fieldNames.splice(index, 1);
          _.forEach(scope.rows, function(row) {
            row.splice(index, 1);
          });
        }

        scope.removeRow = function(index) {
          scope.rows.splice(index, 1);
        }

        scope.newField = function() {
          scope.fieldNames.push("New_Field_" + (scope.count));

          var length = scope.fieldNames.length;
          _.forEach(scope.rows, function(row) {
            row[length - 1] = "New_Value_" + (scope.count);
          });
          scope.count++; 
        }

        scope.newRow = function() {
          var row = [];
          for (var i = 0; i < scope.fieldNames.length; i++) {
            row[i] = "New_Value_" + i + "." + scope.count;
          }
          scope.rows.push(row);
        }
      }
    }
  }]);
});