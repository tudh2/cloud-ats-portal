define(['performance/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ScriptEditorCtrl', 
    ['$scope', '$compile', '$rootScope', '$state','$stateParams', '$cookies', 'Upload', 'ScriptService', 
     '$mdDialog', '$templateRequest', '$filter',
     function($scope, $compile, $rootScope, $state, $stateParams, $cookies, Upload, ScriptService, $mdDialog, $templateRequest, $filter) {
      $scope.projectId = $stateParams.id;
      $scope.scriptId = $stateParams.scriptId;
      
      ScriptService.get($scope.projectId, $scope.scriptId, function (data, status) {
        $scope.script = data;
        // set value for input slider
        $('#users').slider('setValue', $scope.script.number_threads);
        $('#ramup').slider('setValue', $scope.script.ram_up);
        $('#loops').slider('setValue', $scope.script.loops);
        $('#engines').slider('setValue', $scope.script.number_engines);
        if ($scope.script.csv_files === undefined) {
          $scope.script.csv_files = [];
        }
        $scope.totalData = $scope.script.csv_files;
        if ($scope.totalData.length) {
          $scope.csvSelected = $scope.totalData[0];
          ScriptService.getCsvData($scope.scriptId, $scope.csvSelected._id, function (data, status) {
            $scope.data = data;
            $scope.originData = angular.copy($scope.data);
            reload([$scope.query.limit, $scope.query.page]);
          });
        }
      });

      $scope.selected = [];

      var bookmark;
      $scope.query = {
        filter: '',
        limit: 5,
        page: 1
      };  
      $scope.filter = {
        options: {
          debounce: 500
        }
      };

      var $table = $('#csv-data-table');
      $templateRequest('app/performance/views/data-table.tpl.html').then(function(template) {
        $table.html($compile(template)($scope));
      });

      $scope.data = [];
      $scope.originData = [];
      var reload = function(query) {
        var dataSelected = $scope.data.slice((query[1] - 1) * query[0], query[1] * query[0]);
        $scope.params = buildParams($scope.data[0]);
        $scope.dataSelected = dataSelected;
      }

      $scope.$watch('[query.limit, query.page]', function (query) {
        reload(query);
      });

      $scope.$watch('query.filter', function (newData) {
        var filteredData = [];
        var i = 0;
        _.forEach($scope.originData, function (data) {
          data.id = i;
          i ++;
        });
        _.forEach($scope.params, function (param) {
          var expression = {};
          expression[param] = newData;
          
          var results = $filter('filter')($scope.originData, expression);
          _.forEach(results, function (result) {

            if (!(_.some(filteredData, function (temp) {
              return temp.id === result.id;
            }))) {
              filteredData.push(result);
            }
          })
        });
        $scope.data = filteredData;
        reload([$scope.query.limit, $scope.query.page]);
      });

      var buildParams = function (data) {
        var params = [];
        _.forIn(data, function (value, key) {
          if (params.indexOf(key) === -1) {
            params.push(key);
          }
        });
        return params;
      }

      var transformData = function (resp) {
        var obj = {};
        obj.name = resp.data.name;
        obj._id = resp.data._id;
        return obj;
      }

      $scope.addRow = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          fullscreen: true,
          targetEvent: $event,
          templateUrl: 'app/performance/views/add-row.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function () {
            $scope.fields = {};
            $scope.doAddRowData = function() {
              $scope.data.push($scope.fields);
              $mdDialog.hide();
            }
          }
        }).then(function() {
          reload([$scope.query.limit, $scope.query.page]);
        });
      }

      $scope.addColumn = function ($event) {
        var newName = 'Col ' + $scope.params.length;
        if (!$scope.data.length) {
          $scope.params.push(newName);
          return;
        }
        _.forEach($scope.data, function (object) {
          object[newName] = 'empty';
        });
        reload([$scope.query.limit, $scope.query.page]);
      }

      $scope.removeColumn = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/performance/views/remove-column.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function () {
            $scope.columns =  {};

            $scope.deleteCsvColumn = function () {
              
              _.forIn($scope.columns, function (value, key) {
                if (value) {
                  _.remove($scope.params, function (param) {
                    return param === key;
                  });

                  _.forEach($scope.data, function (obj) {
                    delete obj[key];
                  });
                }
              });
              $mdDialog.hide();
            }
          }
        }).then(function () {
          reload([$scope.query.limit, $scope.query.page]);
        });
      }

       $scope.deleteCsvData = function () {
        var objTemp = $scope.data[0];
        _.forEach($scope.selected, function (object) {
          _.remove($scope.data, function (obj) {
            return obj === object;
          });
        });
        
        $scope.selected = [];
        reload([$scope.query.limit, $scope.query.page]);
        if (!$scope.data.length) {
          _.forIn(objTemp, function (value, key) {
            $scope.params.push(key);
          });
        }
      }

      $scope.delete = function() {

        $.SmartMessageBox({
            title: $rootScope.getWord("Delete script"),
            content: $rootScope.getWord("Are you sure to delete the script?"),
            buttons: $rootScope.getWord('[No][Yes]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes" || ButtonPressed ==="はい") {

              ScriptService.delete($scope.projectId, $scope.scriptId, function (data, status) {
                if (status == 202) {
                  $.smallBox({
                    title: $rootScope.getWord("The script has deleted"),
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                    color: "#296191",
                    iconSmall: "fa fa-check bounce animated",
                    timeout: 4000
                  });

                  $state.go("app.performance.scripts", { id : $scope.projectId });
                }
              });
            }
            if (ButtonPressed === "No") {
               return;
            }
        });

      }

      $scope.addNewData = function ($event) {
        var el = $event.currentTarget;
        $(el).next().click();
      }

      $scope.$watch('newFiles', function () {

      });
      $scope.addNewFile = function (element) {
        $scope.newFiles = element.files;
        for (var i = 0; i < $scope.newFiles.length; i++) {
          var file = $scope.newFiles[i];
          Upload.upload({
            url: appConfig.RestEntry + '/api/v1/project/performance/' + $scope.scriptId + '/csv/upload',
            data: {file: file},
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'X-SPACE': $cookies.get('space')
            }
          }).then(function (resp) {
            var obj = transformData(resp);
            $scope.totalData.push(obj);
            ScriptService.getCsvData($scope.scriptId, $scope.totalData[0]._id, function (data, status) {
              $scope.data = data;
              $scope.csvSelected = $scope.totalData[0];
              $scope.originData = angular.copy($scope.data);
              reload([$scope.query.limit, $scope.query.page]);
            });
          });
        }
      }

      function convertArrayOfObjectsToCSV(data) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        if (data == null || !data.length) {
            return null;
        }
        columnDelimiter =',';
        lineDelimiter ='\n';

        keys = Object.keys(data[0]);

        result = '';
        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
      }

      var updateScriptContent = function () {
        ScriptService.update($scope.projectId, $scope.script,  function (data, status) {
          switch (status) {
            case 202 : 
              $.smallBox({
                title: $rootScope.getWord("The script has updated"),
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                color: "#296191",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });

              $state.go('app.performance.scripts', { id: $scope.projectId });

              break;
            case 204 :
              $.smallBox({
                title: $rootScope.getWord("The script has nothing to update"),
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                color: "#296191",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });
              break;
            case 400 :
              $.smallBox({
                title: $rootScope.getWord("The script is not exist"),
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                color: "#296191",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });
              break;
            default:
              break;
          }
        });
      }

      $scope.update = function() {
        if ($scope.csvSelected && JSON.stringify($scope.data) != JSON.stringify($scope.originData)) {
          var blob = new Blob([convertArrayOfObjectsToCSV($scope.data)], {
            "type": "text/csv; charset=utf8;"
          });
          ScriptService.updateTempCSVData(blob, $scope.csvSelected.name, $scope.scriptId, $scope.csvSelected._id, function (data, status) {
            updateScriptContent();
          });
        } else {
          updateScriptContent();
        }
        
      }

      $scope.aceLoaded = function(editor) {
        editor.setFontSize(14);
        editor.getSession().setFoldStyle('markbeginend');
      }

      $scope.$watch('csvSelected', function (data) {
        if (data) {
          ScriptService.getCsvData($scope.scriptId, data._id, function (data, status) {
            $scope.data = data;
            $scope.originData = angular.copy($scope.data);
            reload([$scope.query.limit, $scope.query.page]);
          });
        }
      });
      $scope.files = [];
      if ($scope.files.length > 0) {
        $scope.csvSelected = $scope.files[0];
      }
      $scope.progressPercentage = [];

      $scope.totalData = [];
      $scope.$watch('files', function() {

        if ($scope.files === undefined || $scope.files === null) return;
        for (var i = 0; i < $scope.files.length; i++) {
          var file = $scope.files[i];
          Upload.upload({
            url: appConfig.RestEntry + '/api/v1/project/performance/' + $scope.scriptId + '/csv/upload',
            data: {file: file},
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'X-SPACE': $cookies.get('space')
            }
          }).then(function (resp) {
            var obj = transformData(resp);
            $scope.totalData.push(obj);
            $scope.data = $scope.totalData[0].data;

            $scope.originData = angular.copy($scope.data);
            $scope.csvSelected = $scope.totalData[0];

          }, function (resp) {
          }, function (evt) {
            _.forEach($scope.progressPercentage, function (val) {
              if (val.fileName === evt.config.data.file.name) {
                val.percent = parseInt(100.0 * evt.loaded / evt.total);
              }
            });

            var existed = _.find($scope.progressPercentage, function (val) {
              return val.fileName === evt.config.data.file.name;
            })

            if (existed === undefined || existed === null) {
              $scope.progressPercentage.push({
                'fileName': evt.config.data.file.name,
                'percent': parseInt(100.0 * evt.loaded / evt.total)
              });  
            }
            
          });
        }
      })
      
      $scope.selectCsv = function (file) {

        if (JSON.stringify($scope.data) != JSON.stringify($scope.originData)) {

          var blob = new Blob([convertArrayOfObjectsToCSV($scope.data)], {
            "type": "text/csv; charset=utf8;"
          });
          ScriptService.updateTempCSVData(blob, $scope.csvSelected.name, $scope.scriptId, $scope.csvSelected._id, function (data, status) {
          });
        }


        $scope.csvSelected = file;
        $scope.query.page = 1;
        $scope.query.limit = 5;
      }

      $scope.deleteCsv = function (file) {
        $.SmartMessageBox({
            title: $rootScope.getWord("Delete csv file"),
            content: $rootScope.getWord("Are you sure to delete the csv file"),
            buttons: $rootScope.getWord('[No][Yes]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes" || ButtonPressed ==="はい") {
              _.remove($scope.totalData, function (data) {
                return data._id === file._id;
              });
              if ($scope.totalData.length) {
                $scope.csvSelected = $scope.totalData[0];
              } 
            }
            if (ButtonPressed === "No") {
               return;
            }
        });
      }

      $scope.openFilter = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

      $scope.filterIsShow = false;

      $scope.toggleFilter = function() {
        if ($scope.filterIsShow) {
          $scope.hideFilter();  
        } else {
          $scope.filterIsShow = true;
        }
      }

      $scope.hideFilter = function () {
        $scope.filterIsShow = false;
        $scope.searchTerms = undefined;
      } 

      $scope.close = function () {

        ScriptService.deleteTempCSVData($scope.scriptId, function (data, status) {
        });
        $state.go('app.performance.scripts', {id : $scope.projectId});
      }
    }]);
});