define(['performance/module', 'lodash'], function (module) {
  'use strict';

  module.registerController('ScriptWizardCtrl', ['$scope', '$rootScope', '$state','$stateParams', '$timeout',
    'ScriptService', 'uuid',
    function($scope, $rootScope, $state, $stateParams, $timeout, ScriptService, uuid) {
      
      $scope.projectId = $stateParams.id;
      $scope.organizable = false;
      $scope.organizationMode = false;

      if ($stateParams.scriptId == undefined) {
        $scope.script = {
          number_engines: 1,
          number_threads: 100,
          duration: 0,
          ram_up: 5,
          loops: 1,
          samplers:[]
        };

        $('#users').slider('setValue', $scope.script.number_threads);
        $('#ramup').slider('setValue', $scope.script.ram_up);
        $('#loops').slider('setValue', $scope.script.loops);
        $('#engines').slider('setValue', $scope.script.number_engines);
      } else {
        $scope.scriptId = $stateParams.scriptId;

        ScriptService.get($scope.projectId, $scope.scriptId, function (data, status) {
          $scope.script = data;

          //generate uuid for each sampler
          _.forEach($scope.script.samplers, function(sampler, key){
            sampler._id = uuid.new();
            sampler.arguments.push({
              "paramName": "",
              "paramValue": ""
            });
          });

          if ($scope.script.samplers.length > 1) {
            $scope.organizable = true;
          }

          $('#users').slider('setValue', $scope.script.number_threads);
          $('#ramup').slider('setValue', $scope.script.ram_up);
          $('#loops').slider('setValue', $scope.script.loops);
          $('#engines').slider('setValue', $scope.script.number_engines);
        });
      }

      $scope.$watch('selected', function (newSampler) {
        if (newSampler === undefined) {
          $('.tile-selected').removeClass('tile-selected');
          $('.sampler-list').removeClass('col-sm-6').addClass('col-sm-12')
          $('.sampler-info').addClass('display-none');
        } else if (newSampler._id !== undefined) {
          $('.tile-selected').removeClass('tile-selected');
          $('#' + newSampler._id).addClass('tile-selected');
          $('.sampler-list').removeClass('col-sm-12').addClass('col-sm-6');
          $('.sampler-info').removeClass('display-none');
        }
      });

      $scope.$watch('organizationMode', function(newValue) {
        if (newValue) {
          $scope.selected = undefined;
          $('.tc-itemBlock').addClass('organization');
        } else {
          $('.tc-itemBlock').removeClass('organization');
        }
      });

      $scope.addSampler = function() {
        var sampler = {
          _id: uuid.new(),
          name: 'The New Sampler',
          method: 'GET',
          url: 'http://cloudats.net',
          constant_time: 0,
          arguments: [{
            "paramName": "",
            "paramValue": ""
          }]
        };
        $scope.script.samplers.push(sampler);

        if ($scope.script.samplers.length > 1) {
          $scope.organizable = true;
        }

        $scope.selected = sampler;
        $scope.organizationMode = false;
        $timeout(function() {
          var samplerList = $('.sampler-list');
          var samplerHeight = samplerList[0].scrollHeight;
          samplerList.scrollTop(samplerHeight);
        }, 100)

      }

      $scope.clickSampler = function (sampler) {
        if ($scope.organizationMode) return;

        if ($scope.selected === undefined || $scope.selected._id !== sampler._id) {
          $scope.selected = sampler;
        } else if ($scope.selected._id === sampler._id) {
          $scope.selected = undefined;
        }
      }

      $scope.deleteSampler = function (sampler) {
        $.SmartMessageBox({
            title: $rootScope.getWord("Delete sampler"),
            content: $rootScope.getWord("Are you sure to delete the sampler?"),
            buttons: $rootScope.getWord('[No][Yes]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes" || ButtonPressed ==="はい") {
              _.remove($scope.script.samplers, function(sel) {
                return sel._id === sampler._id;
              });
              
              if ($scope.script.samplers.length < 2) {
                $scope.organizable = false;
              }
              $scope.selected = undefined;
            }
            if (ButtonPressed === "No") {
               return;
            }
        });
      }

      $scope.removeArgument = function (index) {
        $scope.selected.arguments.splice(index, 1);
      }

      $scope.addArgument = function () {
        var param = {'paramName' : '', 'paramValue' : ''};
        $scope.selected.arguments.push(param);
      }

      var verifyScript = function() {
        if ($scope.script.name === '' || $scope.script.name === null || $scope.script.name === undefined) {
          $.smallBox({
            title: "Validation Failed",
            content: "Your script name is empty.",
            color: "#C26565",
            //timeout: 8000,
            icon: "fa fa-warning"
          });
          return false;
        }

        if ($scope.script.samplers.length == 0) {
          $.smallBox({
            title: "Validation Failed",
            content: "Your script must has aleast one sampler.",
            color: "#C26565",
            //timeout: 8000,
            icon: "fa fa-warning"
          });
          return false;
        }

        var invalidSampler = [];
        var messageError = ""

        _.forEach($scope.script.samplers, function (sampler) {
          _.remove(sampler.arguments, function (argument) {
            return (argument.paramName == '' || argument.paramValue == '');
          });
          if (sampler.name === '' || sampler.name === null || sampler.name === undefined) {
            invalidSampler.push(sampler);
            messageError += ("The sampler " + sampler._id.substring(0, 8) + " has empty name.<br>")
          } else if (sampler.url === '' || sampler.url === null || sampler.url === undefined) {
            invalidSampler.push(sampler);
            messageError += ("The sampler " + sampler._id.substring(0, 8) + " has empty url.<br>")
          }
        });

        if (invalidSampler.length > 0) {
          $.smallBox({
            title: "Validation Failed",
            content: messageError,
            color: "#C26565",
            //timeout: 8000,
            icon: "fa fa-warning"
          });
          return false;
        }

        return true;
      }

      $scope.saveScript = function () {

        var valid = verifyScript();
        if (valid) {
          ScriptService.createScript($scope.script, $stateParams.id, function (response) {
            if (response != null) {
              $scope.script._id = response._id;
              $.smallBox({
                title: $rootScope.getWord("The script has created"),
                content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                color: "#296191",
                iconSmall: "fa fa-check bounce animated",
                timeout: 4000
              });

              $state.go('app.performance.scripts', {id : $scope.projectId});
            }
          });
        }
      }

      $scope.updateScript = function () {
        var valid = verifyScript();
        if (valid) {
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

                _.remove($scope.scripts, function (data) {
                  return data._id == $scope.script._id;
                });

                $state.go('app.performance.scripts', {id : $scope.projectId});
                break;
              case 204 :
                $.smallBox({
                  title: $rootScope.getWord("The script has nothing to update"),
                  content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                  color: "#C26565",
                  iconSmall: "fa fa-check bounce animated",
                  timeout: 4000
                });
                break;
              case 400 :
                $.smallBox({
                  title: $rootScope.getWord("The script is not exist"),
                  content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
                  color: "#C26565",
                  iconSmall: "fa fa-check bounce animated",
                  timeout: 4000
                });
                $state.go('app.performance.scripts', {id : $scope.projectId});
                break;
              default:
                break;
            }
          });
        }
      }

    }]);
})