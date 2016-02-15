define(['performance/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('ScriptEditorCtrl', 
    ['$scope', '$rootScope', '$state','$stateParams', '$cookies', 'Upload', 'ScriptService', 
     '$mdDialog', function($scope, $rootScope, $state, $stateParams, $cookies, Upload, ScriptService, $mdDialog) {
      $scope.projectId = $stateParams.id;
      $scope.scriptId = $stateParams.scriptId;

      ScriptService.get($scope.projectId, $scope.scriptId, function (data, status) {
        $scope.script = data;
        // set value for input slider

        $('#users').slider('setValue', $scope.script.number_threads);
        $('#ramup').slider('setValue', $scope.script.ram_up);
        $('#loops').slider('setValue', $scope.script.loops);
        $('#engines').slider('setValue', $scope.script.number_engines);
      });
      $scope.selected = [];

      $scope.query = {
        filter: '',
        order: name,
        limit: 5,
        page: 1
      };  
      $scope.filter = {
        options: {
          debounce: 500
        }
      };
      $scope.$watch('[query.limit, query.page]', function (query) {
        var  dataSelected = $scope.data.slice((query[1] - 1) * query[0], query[1] * query[0]);
        $scope.dataSelected = dataSelected;
      });

      $scope.$watch('selected', function (newData) {
        console.log(newData);
      });
      $scope.data = [
        {id : 'id1', name : 'name1', score: 10},
        {id : 'id2', name : 'name2', score: 7},
        {id : 'id3', name : 'name3', score: 7},
        {id : 'id4', name : 'name4', score: 9},
        {id : 'id5', name : 'name5', score: 5},
        {id : 'id6', name : 'name6', score: 4},
        {id : 'id7', name : 'name7', score: 10},
        {id : 'id8', name : 'name8', score: 2}, 
        {id : 'id9', name : 'name9', score: 7},
        {id : 'id11', name : 'name10', score: 9},
        {id : 'id12', name : 'name11', score: 10},
        {id : 'id13', name : 'name12', score: 3},
        {id : 'id14', name : 'name13', score: 10}

      ];

      $scope.params = [];
      _.forIn($scope.data[0], function (value, key) {
        $scope.params.push(key);
      });
      $scope.addRow = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          focusOnOpen: false,
          controller: 'ScriptEditorCtrl',
          targetEvent: $event,
          templateUrl: 'app/performance/views/add-row.tpl.html'
        });
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

      $scope.update = function() {
        ScriptService.update($scope.projectId, $scope.script, function (data, status) {
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

      $scope.aceLoaded = function(editor) {
        editor.setFontSize(14);
        editor.getSession().setFoldStyle('markbeginend');
      }

      $scope.files = [{name:'data1.csv'}, {name:'data2.csv'}, {name:'data3.csv'}, {name:'data4.csv'}, {name:'data5.csv'}, {name:'data6.csv'}, {name:'data7.csv'}, {name:'data8.csv'}, {name:'data9.csv'}];
      $scope.csvSelected = $scope.files[0];
      $scope.progressPercentage = [];

      /*$scope.$watch('files', function() {

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
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
            console.log('Error status ' + resp.status);
          }, function (evt) {
            console.log(evt.loaded)
            console.log(evt.total);

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
            
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
          });
        }
      })*/

      $scope.selectCsv = function (file) {
        $scope.csvSelected = file;
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

    }]);
});