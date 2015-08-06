define(['performance/module', 'lodash', 'notification'], function (module, _) {
  
  'use strict';

  module.registerController('CreateScriptCtrl', ['$scope', '$stateParams', '$templateRequest', '$compile', 'PerformanceService', 'ScriptService', function($scope, $stateParams, $templateRequest, $compile, PerformanceService, ScriptService) {

    
    $scope.script = {
      ram_up: 5,
      number_threads: 1,
      duration: 0,
      loops: 1,
      samplers: [
      ]
    };

    $scope.selected = {
      method: 'GET',
      constant_time: 0,
      arguments: [{
        "paramName": "",
        "paramValue": ""
      }]
    };

    // create script with scrip name, list samplers, project id, configurationn information
    $scope.clickSaveScript = function () {
      ScriptService.createScript($scope.script, $stateParams.id, function (response) {
        if (response != null) {
          $scope.script._id = response._id;
          $.smallBox({
            title: "The script has created",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#296191",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });

          $scope.scripts.push(response);

        }
      });
    }

    $scope.deleteScript = function (script) {
      ScriptService.delete(script._id, function (data, status) {
        if (status == 202) {
          $.smallBox({
            title: "The script has deleted",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#296191",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });

          _.remove($scope.scripts, function (data) {
            return data._id === script._id;
          });
        }
      });

    }

    $scope.clickUpdateScript = function () {
      ScriptService.update($scope.script, function (data, status) {
        switch (status) {
          case 202 : 
            $.smallBox({
              title: "The script has updated",
              content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
              color: "#296191",
              iconSmall: "fa fa-check bounce animated",
              timeout: 4000
            });
            break;
          case 204 :
            $.smallBox({
              title: "The script has no modification",
              content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
              color: "#296191",
              iconSmall: "fa fa-check bounce animated",
              timeout: 4000
            });
            break;
          case 400 :
            $.smallBox({
              title: "The script is not exist",
              content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
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

    $scope.createSampler = function (sampler, $event) {
     _.remove(sampler.arguments, function (argument) {
        return (argument.paramName == '' || argument.paramValue == '');
      });

      $scope.script.samplers.push(sampler);
      $scope.selected = {
        method: 'GET',
        constant_time: 0,
        arguments: [{
          "paramName": "",
          "paramValue": ""
        }]
      };
    }

    $scope.deleteSampler = function (index) {
      $scope.script.samplers.splice(index, 1);
      $scope.selected = {
        method: 'GET',
        constant_time: 0,
        arguments: [{
          "paramName": "",
          "paramValue": ""
        }]
      };
    }

    $scope.resetSamplerForm = function () {
      $scope.selected = {
        method: 'GET',
        constant_time: 0,
        arguments: [{
          "paramName": "",
          "paramValue": ""
        }]
      };
      var $saveButton = $('.btn-uploadFile');
      $saveButton.show();
    }

    $scope.chooseSampler = function (i, index) {
      _.remove(i.arguments, function (argument) {
        return (argument.paramName == '' || argument.paramValue == '');
      });

      if (i.arguments.length == 0) {
        i.arguments.push({
          "paramName": "",
          "paramValue": ""
        });
      }
      $scope.selected = i;
      $scope.selected.index = index;

      var $saveButton = $('.btn-uploadFile');
      $saveButton.hide();
    }

    $scope.clickUploadScriptButton = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '20px');
    };

    $scope.clickCreateScriptButton = function () {
      var $modal = $('#createScript');

      //clear modal content
      $modal.html('');

       $scope.selected = {
        method: 'GET',
        constant_time: 0,
        arguments: [{
          "paramName": "",
          "paramValue": ""
        }]
      };

      $scope.script = {
        ram_up: 5,
        number_threads: 1,
        duration: 0,
        loops: 1,
        samplers: [
        ]
      };
      $templateRequest('app/performance/views/script-modal-content.tpl.html').then(function (template) {

        $modal.html($compile(template)($scope));
      });
    };

    $scope.editScript = function (id) {
       $scope.selected = {
        method: 'GET',
        constant_time: 0,
        arguments: [{
          "paramName": "",
          "paramValue": ""
        }]
      };
      var $modal = $('#createScript');
      $templateRequest('app/performance/views/script-modal-content.tpl.html').then(function (template) {
        $modal.html($compile(template)($scope));
      });

      ScriptService.get(id, function (data, status) {
        $scope.script = data;
      });
    }

    $scope.removeArgument = function (index) {
      $scope.selected.arguments.splice(index, 1);
    }

    $scope.addArgument = function () {
      var param = {'paramName' : '', 'paramValue' : ''};
      $scope.selected.arguments.push(param);
    }

    $scope.newSampler = function () {
      changeModalSize();
    };

    $scope.basic = function () {
      resetModalSize();
    };

    $scope.configuration = function () {
      resetModalSize();
      setConfigurationInfo($scope.script);
    };

    var resetModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "");
    };

    var changeModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '980px');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '-120px');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "0px");
    };

    var setConfigurationInfo = function (data) {
      // set value for input slider
      $('#users').bootstrapSlider('setValue', data.number_threads);
      $('#ramup').bootstrapSlider('setValue', data.ram_up);
      $('#loops').bootstrapSlider('setValue', data.loops);
      $('#duration').bootstrapSlider('setValue', data.duration);

      // show value slider in span tag
      $("#usersSliderVal").text(data.number_threads);
      $("#ramupSliderVal").text(data.ram_up);
      $("#loopsSliderVal").text(data.loops);
      $("#durationSliderVal").text(data.duration);
    }

  }]);

});