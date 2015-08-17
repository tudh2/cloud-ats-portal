define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('DrivenCtrl', [
    '$scope', '$rootScope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 'DataService',
    function($scope, $rootScope, $stateParams, $templateRequest, $compile, CaseService, DataService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'DATA DRIVEN';

      $scope.driven_name = "";

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
      });

      $scope.editableOptions = {
          mode: 'inline',
          disabled: false
      }

      var buildDataset = function(caze) {
        $scope.dataset = [];
        $scope.params = [];
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
              $scope.params.push(variable);
            }
          });
        });

        var obj = {};
        _.forEach($scope.params, function(param) {
          obj[param] = param + '_value';
        });

        $scope.copyDatasetInit = angular.copy(obj);

        $scope.dataset.push(obj);

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

        if (caze.data_driven == null) {
          $scope.driven_name = "";
          buildDataset($scope.current);
        } else {
          $scope.dataset = [];
          DataService.dataSet(caze.data_driven._id).then(function (response) {

            $scope.dataset = JSON.parse(response.data.data_source);
            $scope.driven_name = response.data.name;
          });
        }
       
        loadModal();
      };

      $scope.addNewRow = function() {
        var newObj = angular.copy($scope.copyDatasetInit);
        $scope.dataset.push(newObj);
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

      $scope.createNewData = function(data) {
        var $input = $('input[name="driven-name"]');
        var parent_input = $input.parent();
        var grand_input = parent_input.parent();

        $scope.checkSaveData = true;
        $scope.dataset = data; 
        var val = $input.val();

        if (!val) {
          $input.focus();
          parent_input.addClass('has-error');
          var parent
          grand_input.append('<span class="invalid-name-datadriven hasnot-case">Name is required</span>');
          return false;
        }
        parent_input.removeClass('has-error');
        grand_input.find('.invalid-name-datadriven').remove();
        var $trdata = $('.tr-table-datadriven');
        $scope.listDataSet = [];

        for(var attr in $scope.copyDatasetInit) {
          $scope.listDataSet.push($scope.copyDatasetInit[attr]);
        }

         $trdata.each(function() {
            var cell = 0;
            $scope.dataValid = true;
            $.each(this.cells, function(){
                if(_.isEqual($(this).text().trim(), $scope.listDataSet[cell])) {
                  //console.log($(this).text());
                  $(this).children().addClass('hasnot-case');
                  $scope.dataValid = false;
                }
                cell ++;
            });
        });

        if(!$scope.dataValid) {
          $.smallBox({
              title: 'Notification',
              content: 'Data is invalid',
              color: '#FF0000',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 2000
          });
          return false;

        } else {

          if($scope.current.data_driven === null) {
            DataService.create($scope.driven_name.trim(), $scope.dataset, $scope.current._id, function(data, status) {
              $.smallBox({
                  title: 'Notification',
                  content: 'Dataset has created',
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
                    title: 'Notification',
                    content: 'Dataset has nothing to update',
                    color: '#296191',
                    iconSmall: 'fa fa-check bounce animated',
                    timeout: 3000
                  });
                  break;
                case 200:
                  $.smallBox({
                    title: 'Notification',
                    content: 'Dataset has updated',
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
          
        }
      };

      $scope.chooseDataDriven = function() {
          var tenant = $rootScope.context.tenant._id;
          var space = $rootScope.context.space;
          if (space === undefined) {
            space = {_id: null};
          }
          var options = "";
          DataService.list(tenant, space._id).then(function (data){
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