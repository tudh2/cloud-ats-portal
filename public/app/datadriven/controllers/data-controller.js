define(['datadriven/module', 'lodash'], function(module, _) {
  
  'use strict';
  module.registerController('DataCtrl',['$filter', '$rootScope', '$state', '$mdDialog', '$scope', '$templateRequest', '$compile', 'CaseService', 'UserService', 'DataService', 
  	function ($filter, $rootScope, $state, $mdDialog, $scope, $templateRequest, $compile, CaseService, UserService, DataService) {

      $scope.current = undefined;
      $scope.dataset = [];
      $scope.editable = false;
      $scope.create = false;
      $scope.datas = [];

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
      $scope.edit = false;
      $scope.data = [];
      $scope.originData = [];
      $scope.filteredData  = [];
      DataService.list(function (data, status) {
        $scope.datas = data;
        if ($scope.datas.length > 0) {
          $scope.current = $scope.datas[0];
             DataService.get($scope.current._id).then(function (response) {
             $scope.data = JSON.parse(response.data.data_source);
             $scope.originData = angular.copy($scope.data);
             reload([$scope.query.limit, $scope.query.page]);
        });
          
        } else {
          $('.data-provider').find('.driven-name').hide();
          $('.data-provider').find('.edit-button').hide();
        }
      });

      $scope.filterIsShow = false;

      var reload = function(query) {
        var dataSelected = $scope.data.slice((query[1] - 1) * query[0], query[1] * query[0]);
        dataSelected.params = buildParams($scope.originData[0]);
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
      
      $scope.$watch('data', function (newData, oldData) {
          if (JSON.stringify(newData) != JSON.stringify($scope.originData)) {
            $scope.edit = true;
          } else $scope.edit = false;
      }, true);

      $scope.$watch('query.filter', function (newData) {
        var filteredData = [];
        var i = 0;
        _.forEach($scope.originData, function (data) {
          data.id = i;
          i ++;
        });
        _.forEach($scope.dataSelected.params, function (param) {
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


    

      var loadDataset = function (id) {
        DataService.get(id).then(function (response) {
          $scope.dataset = JSON.parse(response.data.data_source);
        });
      }

      $scope.chooseData = function (data) {
        $scope.editable = false;
        $scope.create = false;
        $scope.current = data;
        
        $scope.current.name = data.name;

        DataService.get($scope.current._id).then(function (response) {
          $scope.data = JSON.parse(response.data.data_source);
          $scope.originData = angular.copy($scope.data);
          $scope.query.page = 1;
          $scope.query.limit = 5;
          reload([$scope.query.limit, $scope.query.page]);
        });
      }

      $scope.clickNewDataDrivenButton = function ($event) {
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
        $scope.currentName = angular.copy($scope.current.name);
        $scope.editable = true;
      }

      $scope.cancelEdit = function () {
        $scope.edit = false;
       /* if ($scope.current === undefined || $scope.current._id === undefined) {
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
          $scope.current.name = $scope.currentName;
          $scope.editable = false;
        }*/
        $scope.data = $scope.originData;
        reload([$scope.query.limit, $scope.query.page]);

        $scope.originData = angular.copy($scope.data);
        /*var $input = $('.data-provider div .driven-name');
        $input.removeClass('has-error');*/
      }

      $scope.updateDataDriven = function () {
       /* var $data_name = $('.data-provider div .driven-name').find('input');
        if ($data_name.val().trim() === undefined || $data_name.val().trim() === '') { 

          $data_name.parent().addClass("has-error");
          $data_name.focus();
          return;
        };
        
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
        });*/

        DataService.update($scope.current.name, $scope.data, $scope.current._id, function(data, status) {
          
          if (status == 200) {
            $scope.create = false;
            $scope.editable = false;
            $.smallBox({
              title: "Data Driven",
              content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has updated.")+"</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            $scope.dataset = JSON.parse(data.data_source);
            $scope.current.data_source = data.data_source;
            $scope.edit = false;
          }
          if (status == 304) {
            $scope.create = false;
            $scope.editable = false;
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

      $('body').on('keyup', '.data-provider div .driven-name input', function () {

        if ($(this).val().trim() != "") {
          $(this).parent().removeClass('has-error');
        }
      });

      $scope.createDataDriven = function () {

        var $data_name = $('.data-provider div .driven-name').find('input');
        if ($data_name.val().trim() === undefined || $data_name.val().trim() === '') { 

          $data_name.parent().addClass("has-error");
          $data_name.focus();
          return;
        };
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
              content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has created.")+"</i>",
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
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("Your data driven has deleted")+"</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
                  });
                  $scope.datas.splice(index, 1);
                  $scope.dataset = [];
                  if ($scope.datas.length > 0) {
                    $scope.current = $scope.datas[0];
                    DataService.get($scope.current._id).then(function (response) {
                    $scope.data = JSON.parse(response.data.data_source);
                    $scope.params = buildParams($scope.data[0]);
                  });
                    
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


      $scope.$watch('editable', function (value) {
        if (value === true) {
          disableChooseLang();
        } else {
          unableChooseLang();
         }
      });

      var disableChooseLang = function () {
        var $header = $('#header');
        var $langOptions = $header.find('.pull-right .header-dropdown-list .dropdown .dropdown-toggle');
        $langOptions.css('pointer-events', 'none');
      }

      var unableChooseLang = function () {
        var $header = $('#header');
        var $langOptions = $header.find('.pull-right .header-dropdown-list .dropdown .dropdown-toggle');
        $langOptions.css('pointer-events', 'initial');
      }

      //tudh2
       $scope.addRow = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/add-row.tpl.html',
          locals: {
            params: $scope.dataSelected.params,
            data: $scope.data
          },
          controller: function AddController($scope, $mdDialog, params, data) {

            $scope.fields = {};
            $scope.params = params;
            $scope.data = data;
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
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/add-column.tpl.html',
          locals: {
            params: $scope.dataSelected.params,
            data: $scope.data
          },
          controller: function AddController($scope, $mdDialog, params, data) {

            $scope.data = data;
            $scope.originData = angular.copy($scope.data);
            $scope.doAddColumnData = function() {
              var newName = $scope.column_name ;
              
              $mdDialog.hide();
              _.forEach($scope.data, function (object) {
                object[newName] = 'empty';
              });

            }
          }
        }).then(function() {
          
          reload([$scope.query.limit, $scope.query.page]);
        });
      }

      $scope.removeColumn = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          targetEvent: $event,
          templateUrl: 'app/datadriven/views/remove-column.tpl.html',
          locals: {
            params: $scope.dataSelected.params,
            data: $scope.data
          },
          controller: function RemoveController($scope, $mdDialog, params, data) {
            $scope.columns =  {};
            $scope.params = params;
            $scope.data = data;

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
        });
      }

      $scope.deleteRowDataDriven = function () {
        _.forEach($scope.selected, function (object) {
          _.remove($scope.data, function (obj) {
            return obj === object;
          });
        });
        $scope.selected = [];
        reload([$scope.query.limit, $scope.query.page]);
      }

      
    }]);
})