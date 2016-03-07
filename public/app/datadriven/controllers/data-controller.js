define(['datadriven/module', 'lodash'], function(module, _) {
  
  'use strict';
  module.registerController('DataCtrl',['$cookies', 'Upload', '$filter', '$rootScope', '$state', '$mdDialog', '$scope', '$templateRequest', '$compile', 'CaseService', 'UserService', 'DataService', 
  	function ($cookies, Upload, $filter, $rootScope, $state, $mdDialog, $scope, $templateRequest, $compile, CaseService, UserService, DataService) {

      $scope.current = undefined;
      $scope.datas = [];
      $scope.selected = [];
      $scope.edit = false;
      $scope.data = [];
      $scope.originData = [];
      $scope.filteredData  = [];
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
      
      DataService.list(function (data, status) {
        $scope.datas = data;
        if ($scope.datas.length > 0) {
          $scope.current = $scope.datas[0];
          DataService.get($scope.current._id).then(function (response) {
            $scope.data = JSON.parse(response.data.data_source);
            $scope.originData = angular.copy($scope.data);
            reload([$scope.query.limit, $scope.query.page]);
            $scope.originParam = angular.copy($scope.params);
          });
        } 
      });

      $scope.filterIsShow = false;

      var reload = function(query) {
        var dataSelected = $scope.data.slice((query[1] - 1) * query[0], query[1] * query[0]);
        var params = buildParams($scope.data[0]);
        $scope.params = params;
        $scope.dataSelected = dataSelected;
      }

      $scope.$watch('[query.limit, query.page]', function (query) {
        reload(query);
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
      
      var filter = function (newData) {
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
        _.forEach($scope.originData, function (data) {
          delete data.id;
        });
        i = 0;
         _.forEach($scope.filteredData, function (data) {
          delete data.id;
        });
        $scope.data = filteredData;
        reload([$scope.query.limit, $scope.query.page]);
        $scope.params = $scope.originParam;
      }
      $scope.$watch('query.filter', function (newData) {
        filter(newData);
      });

      $scope.chooseData = function (data) {
        $scope.edit = false;
        $scope.current = data;
        $scope.current.name = data.name;

        DataService.get($scope.current._id).then(function (response) {
          $scope.data = JSON.parse(response.data.data_source);
          $scope.originData = angular.copy($scope.data);
          $scope.query.page = 1;
          $scope.query.limit = 5;
          reload([$scope.query.limit, $scope.query.page]);
          $scope.originParam = angular.copy($scope.params);
        });
      }

      $scope.changeParam = function () {
        $scope.edit = true;
      }

      $scope.changeData = function () {
        $scope.edit = true;
      }

      $scope.cancelEdit = function () {
        $scope.data = $scope.originData;
        $scope.edit = false;
        reload([$scope.query.limit, $scope.query.page]);
        $scope.originData = angular.copy($scope.data);
        if (!$scope.current._id) {
          _.remove($scope.datas, function (data) {
            return !data._id;
          });
          $scope.current = $scope.currentTag;
        } 
      }

      $scope.addNewFile = function (files) {
        $scope.newFiles = files;
        for (var i = 0; i < $scope.newFiles.length; i++) {
          var file = $scope.newFiles[i];
          Upload.upload({
            url: appConfig.RestEntry + '/api/v1/data/' + null + '/upload/'+null,
            data: {file: file},
            headers: {
              'X-AUTH-TOKEN': $cookies.get('authToken'),
              'Content-Type': undefined
            }
          }).then(function (response) {
            $scope.data = JSON.parse(response.data.data_source);
            $scope.originData = angular.copy($scope.data);
            $scope.query.page = 1;
            $scope.query.limit = 5;
            $scope.current = response.data;
            $scope.datas.push(response.data);
            reload([$scope.query.limit, $scope.query.page]);
            $scope.originParam = angular.copy($scope.params);
          });
        }
      }
      $scope.updateDataDriven = function () {
        if ($scope.query.filter != '') {
          $scope.query.filter = '';
          filter($scope.query.filter);
        }

        var updatedData = [];

        _.forEach($scope.data, function (data) {
          var obj = {};
          _.forEach($scope.params, function (param) {

            var index = _.indexOf($scope.params, param);
            var key = Object.keys(data)[index];
            var value = data[key];
            obj[param] = value;
          });
          updatedData.push(obj);
        });
        if (!$scope.current._id) {
          DataService.create($scope.current.name, updatedData, 'null', function(data, status) {
            if (status == 200) {
              $.smallBox({
                title: "Data Driven",
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has created.")+"</i>",
                color: "#659265",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: 2000
              });

              $scope.current._id = data._id;
            }
          });
        } else {
          DataService.update($scope.current.name, updatedData, $scope.current._id, function(data, status) {
            if (status == 200) {
              $.smallBox({
                title: "Data Driven",
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has updated.")+"</i>",
                color: "#659265",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: 2000
              });
              $scope.data = JSON.parse(data.data_source);
              $scope.originData = angular.copy($scope.data);
              reload([$scope.query.limit, $scope.query.page]);
              $scope.originParam = angular.copy($scope.params);
              $scope.edit = false;
            }
            if (status == 304) {
              $.smallBox({
                title: "Data Driven",
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has nothing to update.")+"</i>",
                color: "#659265",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: 2000
              });
            }
            
          });
        }
        $scope.edit = false;
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
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has deleted")+"</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
                  });
                  $scope.datas.splice(index, 1);
                  $scope.data = [];
                  if ($scope.datas.length) {
                    $scope.current = $scope.datas[0];
                    DataService.get($scope.current._id).then(function (response) {
                      $scope.data = JSON.parse(response.data.data_source);
                      reload([$scope.query.limit, $scope.query.page]);
                    });
                  } else {
                    $scope.data = undefined;
                    $scope.dataSelected = undefined;
                    $scope.params = undefined;
                    $scope.current = undefined;
                  } 
                }
              });
            }
            if (ButtonPressed === "No") {
               return;
            }
        });
      }

      //tudh2

      $scope.addNewDataDriven = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/add-new-data-driven.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function AddController() {
            $scope.doAddNewData = function () {
              $scope.currentTag = angular.copy($scope.current);
              var data_driven_name = $scope.data_name;
              var obj = {};
              obj.name = data_driven_name;
              $scope.datas.push(obj);
              $scope.current = obj;
              $mdDialog.hide();
              $scope.data = [];
              $scope.data.push({'Col 1' : 'empty'});
            }
          }
        }).then(function () {
          reload([$scope.query.limit, $scope.query.page]);
          $scope.edit = true;
        });
      }

      $scope.addRow = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/add-row.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function AddController() {

            $scope.fields = {};
            $scope.doAddRowData = function() {
              $scope.data.push($scope.fields);
              $mdDialog.hide();
            }
          }
        }).then(function() {
          reload([$scope.query.limit, $scope.query.page]);
          $scope.edit = true;
        });
      }
       $scope.addColumn = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/add-column.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function AddController() {

            $scope.doAddColumnData = function() {
              var newName = $scope.column_name;
              _.forEach($scope.data, function (object) {
                object[newName] = 'empty';
              });
              $mdDialog.hide();
            }
          }
        }).then(function() {
          if (!$scope.data.length) {
            $scope.params.push($scope.column_name);
            return;
          }
          reload([$scope.query.limit, $scope.query.page]);
          $scope.edit = true;
        });
      }

      $scope.removeColumn = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/remove-column.tpl.html',
          scope: $scope,
          preserveScope: true,
          controller: function RemoveController() {
            $scope.columns =  {};

            $scope.deleteDataDrivenColumn = function () {
              
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
          $scope.originData = angular.copy($scope.data);
          reload([$scope.query.limit, $scope.query.page]);
          $scope.edit = true;
        });
      }

      $scope.deleteRowDataDriven = function () {

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
        $scope.edit = true;
      }

      $scope.addNewData = function ($event) {
        var el = $event.currentTarget;
        $(el).parent().next().click();
      }
    }]);
})