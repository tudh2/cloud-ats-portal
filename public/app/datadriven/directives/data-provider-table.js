define(['datadriven/module', 'lodash'], function(module, _) {
  'use strict';

  return module.registerDirective('providerTable', ['$rootScope', function($rootScope) {
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
            var new_field = $rootScope.getWord('New_Field');
            scope.fieldNames = [new_field];
            var new_val = $rootScope.getWord('New_Value');
            scope.rows = [[new_val]];
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

          var new_field_ = $rootScope.getWord('New_Field_');
          scope.fieldNames.push(new_field_ + (scope.count));

          var length = scope.fieldNames.length;
          var new_val_ = $rootScope.getWord("New_Value_");
          _.forEach(scope.rows, function(row) {
            row[length - 1] = new_val_ + (scope.count);
          });
          scope.count++; 
        }

        scope.newRow = function() {
          var row = [];
          var new_val_ = $rootScope.getWord("New_Value_");
          for (var i = 0; i < scope.fieldNames.length; i++) {
            row[i] = new_val_ + i + "." + scope.count;
          }
          scope.rows.push(row);
        }
      }
    }
  }]);
});