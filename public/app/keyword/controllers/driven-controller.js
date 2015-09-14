define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('DrivenCtrl', [
    '$scope', '$rootScope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 'DataService',
    function($scope, $rootScope, $stateParams, $templateRequest, $compile, CaseService, DataService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'DATA DRIVEN';

      $scope.driven_name = "";

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = [];
        _.forEach(response, function(caze) {
          var params = buildParamList(caze);
          if (params.length > 0) $scope.cases.push(caze);
        })
      });

      var buildParamList = function(caze) {
        var params = [];
        _.forEach(caze.steps, function(step) {
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
        return params;
      };

      var newRow = function(params) {
        var obj = {};
        _.forEach(params, function(param) {
          obj[param] = param + '_value';
        });
        return obj;
      };

      var buildDataset = function(caze) {
        $scope.dataset = [];
        var params = buildParamList(caze);
        $scope.dataset.push(newRow(params));
      };


      var loadModal = function() {
        var $modal = $('#add-datadriven');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/datadriven-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });
      };

      $scope.clickToCase = function(caze) {
        $scope.current = caze;
        $scope.params = buildParamList(caze);

        if (caze.data_driven == null) {
          $scope.driven_name = "";
          buildDataset($scope.current);
        } else {
          $scope.dataset = [];
          DataService.get(caze.data_driven._id).then(function (response) {
            $scope.dataset = JSON.parse(response.data.data_source);
            $scope.driven_name = response.data.name;

          });
        }
       
        loadModal();
      };

      $scope.addNewRow = function() {
        var params = buildParamList($scope.current);
        $scope.dataset.push(newRow(params));
      }

      $scope.resetData = function() {
        var sizeDataset = $scope.dataset.length;
        var initObj = angular.copy($scope.copyDatasetInit);
        $scope.dataset.splice(0,sizeDataset);
        $scope.dataset.push(initObj);
      }

      $scope.changeParamValue = function(value, attributes) {
        var index = attributes.indexDataset;
        var dataset = $scope.dataset[index];
        var nameParam = attributes.nameParam;
        var ele = attributes.$$element;

        for(var item in dataset) {
          if(_.isEqual(item, nameParam)) {
              dataset[item] = value.trim();
          }
        }
        
        ele.removeClass('hasnot-case');
      };

      $scope.createNewData = function() {
        var $input = $('input[name="driven-name"]');

        var val = $input.val();

        if (!val) {
          $input.focus();
          return;
        }

        if($scope.current.data_driven === null) {
          DataService.create($scope.driven_name.trim(), $scope.dataset, $scope.current._id, function(data, status) {
            $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Dataset has created'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
            });
            var obj = {_id : data._id};
            $scope.current.data_driven = obj;
            $('#add-datadriven').modal('hide');
          });
        } else {
          DataService.update($scope.driven_name.trim(), $scope.dataset, $scope.current.data_driven._id, function (data, status) {
            
            switch (status) {
              case 304: 
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Dataset has nothing to update'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              case 200:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Dataset has updated'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              default:
                break;
            }
            
            $('#add-datadriven').modal('hide');
          });
        }
      };

      $scope.chooseDataDriven = function() {
          var tenant = $rootScope.context.tenant._id;
          var space = $rootScope.context.space;
          if (space === undefined) {
            space = {_id: null};
          }
          var options = "";

          DataService.list(function (data, status) {
            _.forEach(data, function(sel) {
              options += "[ "+$rootScope.getWord('name')+" = ";
              options += sel.name;
              options += " | "+$rootScope.getWord('id')+" = "
              options += sel._id;
              options += "]";
            });

            $.SmartMessageBox({
              title: $rootScope.getWord('Data Driven: Select'),
              content: $rootScope.getWord('Choose your data existed'),
              buttons: "["+$rootScope.getWord('Done')+"]["+$rootScope.getWord('Cancel')+"]",
              input: "select",
              options: options
            }, function (ButtonPress, Value) {
              if (ButtonPress === "Done") {
                updateDataforCase(Value,data);
              }
            });
          });
        };

        var updateDataforCase = function(value,data) {
          var startIndex = value.indexOf(' | id = ') + ' | id = '.length;
          var id = value.substring(startIndex);
          var dataset = _.find(data, function(sel) {
            return sel._id === id;
          });
          var driven = {
            _id : dataset._id,
            name : dataset.name,
            data_source : JSON.parse(dataset.data_source)
          };

          $scope.current.data_driven = driven;

          CaseService.update($scope.projectId,$scope.current, function(data, status) {
            $('#add-datadriven').modal('hide');
          });
        }

    }]);
});