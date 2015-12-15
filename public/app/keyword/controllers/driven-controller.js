define(['keyword/module'], function (module) {
  'use strict';

  module.registerController('DrivenCtrl', [
    '$scope', '$rootScope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 'DataService',
    function($scope, $rootScope, $stateParams, $templateRequest, $compile, CaseService, DataService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'DATA DRIVEN';

      $scope.driven_name = "";

      $scope.importType = 'table';

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
      };

      $scope.resetData = function() {
        var sizeDataset = $scope.dataset.length;
        var initObj = angular.copy($scope.copyDatasetInit);
        $scope.dataset.splice(0,sizeDataset);
        $scope.dataset.push(initObj);
      };

      $scope.removeRowData = function(_index,$event) {
        $scope.dataset.splice(_index,1);
      };

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
                content: $rootScope.getWord('Dataset has been created'),
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
                  content: $rootScope.getWord('Dataset has been updated'),
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

      $('body').on('click','.csv', function() {
        if($scope.importType !== 'csv') {
          $scope.importType = 'csv';
          var selectElement = $('select');
          var uploadDataElement = $('div .upload-data-form');
          var child = selectElement.next();
          var childFirst = child.children(':first');

          childFirst.attr('disabled',true);
          selectElement.hide();
          uploadDataElement.show();
        }
      });

      $('body').on('click','.table-data', function() {
          if($scope.importType !== 'table') {
            $scope.importType = 'table';
            var selectElement = $('select');
            var uploadElement = $('.upload-data-form');
            var selectElement = $('select');
            var child = selectElement.next();
            var childFirst = child.children(':first');
            childFirst.attr('disabled',false);
            uploadElement.hide();
            selectElement.show();
          }
      });

      $('body').on('change','#uploadFile',function() {
        var listFile = $('#uploadFile')[0];
        $scope.file = listFile.files[0];
        if($scope.file !== undefined) {
          var fileName = $scope.file.name;
          var lastIndex = _.lastIndexOf(fileName, ".");
          var extension = fileName.substring(lastIndex + 1);
          if(extension === 'csv') {
            var selectElement = $('select');
            var child = selectElement.next();
            var childFirst = child.children(':first');
            childFirst.removeAttr('disabled');
          }
        }

      }) ;

      var upload = function() {

        if($scope.file === undefined) {
          $.smallBox({
            title: $rootScope.getWord('Notification'),
            content: $rootScope.getWord('File is not empty !'),
            color: '#C00000',
            iconSmall: 'fa fa-check bounce animated',
            timeout: 3000
          });
        } else if($scope.file){
          var fileName = $scope.file.name;
          var fileSize = $scope.file.size/1024;
          var lastIndex = _.lastIndexOf(fileName, ".");
          var extension = fileName.substring(lastIndex + 1);

          if(fileSize/1024 > 10) {
            $.smallBox({
              title: $rootScope.getWord('Notification'),
              content: $rootScope.getWord('File size is too large. The maximum file size allowed is 10 Mb.'),
              color: '#C00000 ',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            $('#uploadFile').val('');
            $scope.file = undefined;
            return;
          }
          var caseId = $scope.current._id;
          var arrayParams = buildParamList($scope.current);
          var params = [];

          for(var i = 0; i < arrayParams.length; i++) {
            var temp = {"param":arrayParams[i]};
            params.push(temp);
          }

          DataService.upload(params,caseId, $scope.projectId, $scope.file, function(data, status) {
             var driven = {
              _id : data._id,
              name : data.name,
              data_source : JSON.parse(data.data_source)
            };

            $scope.current.data_driven = driven;
            var $input = $('input[name="driven-name"]');
            $scope.driven_name = $scope.file.name;
            $input.attr('disabled',true);
            $('#add-datadriven').modal('hide');
            $.smallBox({
              title: $rootScope.getWord('Notification'),
              content: $rootScope.getWord('Upload Success!'),
              color: '#296191',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            $scope.importType = 'table';
          });
        }
      }

      $scope.chooseDataDriven = function() {
          $scope.importType = 'table';
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
              if (ButtonPress === $rootScope.getWord('Done')) {
                if($scope.importType === 'table') {
                  updateDataforCase(Value,data);
                } else if($scope.importType === 'csv') {
                  upload();
                }
              }
            });

            var selectElement = $('select');
            selectElement.before('<div class="check-type-import row">'
                +'<label class="table-data col-sm-2"><input type="radio" class="radio-table" name="type" value="table" checked>Table</label>'
                +'<label class="csv col-sm-2"><input type="radio" class="radio-csv" name="type" value="csv">CSV</label>'
                +'</div>');
            
            var checkTypeImport = $('div .check-type-import');
            checkTypeImport.after('<div class="form-content upload-data-form" hidden>'
            +'<form class="form-horizontal ng-pristine ng-valid">'
              +'<div class="form-group">'
                +'<label class="col-sm-2 label-upload">Upload CSV File</label>'
                +'<div class="col-sm-10 upload-file">'
                  +'<input type="file" name="chooseFile" id="uploadFile">'
                +'</div>'
              +'</div>'
            +'</form>'
          +'</div>');

          });

          
        };

        var updateDataforCase = function(value,data) {
          var startIndex = value.indexOf(" | "+$rootScope.getWord('id')+" = ") + (" | "+$rootScope.getWord('id')+" = ").length;
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