define(['performance/module', 'lodash', 'notification'], function (module, _) {
  
  'use strict';

  module.registerController('CreateScriptCtrl', ['$scope', '$rootScope', '$stateParams', '$templateRequest', '$compile', 'PerformanceService', 'ScriptService', function($scope, $rootScope, $stateParams, $templateRequest, $compile, PerformanceService, ScriptService) {

    $scope.projectId = $stateParams.id;
    $scope.script = {
      ram_up: 5,
      number_threads: 1,
      duration: 0,
      loops: 1,
      samplers: [
      ]
    };

    $scope.createNewButton = true;
    $scope.selected = {
      method: 'GET',
      constant_time: 0,
      arguments: [{
        "paramName": "",
        "paramValue": ""
      }]
    };

    $('body').on('keypress', '.name-script textarea[name="text-area-script"]', function () {

      $(this).parent().removeClass('has-error');
    });
    // create script with scrip name, list samplers, project id, configurationn information
    $scope.clickSaveScript = function () {

      _.forEach($scope.script.samplers, function (sampler) {
        _.remove(sampler.arguments, function (argument) {
          return (argument.paramName == '' || argument.paramValue == '');
        });
      });

      var $modal = $('#createScript');
      var $script_name = $('.script-name').find('.text-area-script');
      if (!$scope.script.name) {
        $script_name.parent().addClass('has-error');
        return;
      }

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

          $scope.scripts.push(response);
          $modal.modal('hide');
        }
      });
    }

    $scope.deleteScript = function (script) {
      ScriptService.delete($scope.projectId, script._id, function (data, status) {
        if (status == 202) {
          $.smallBox({
            title: $rootScope.getWord("The script has deleted"),
            content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("1 seconds ago")+"...</i>",
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

            $scope.scripts.push($scope.script);
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

    // get element to validate sampler form
    var $sampler_name = $('.name-sampler input[name="name"]');
    var $sampler_url = $('.sampler-url input[name="url"]');

    $('body').on('keypress', '.name-sampler input[name="name"]', function () {
      $(this).parent().removeClass('has-error');
    });

    $('body').on('keypress', '.sampler-url input[name="url"]', function () {
      $(this).parent().removeClass('has-error');
    });

    $scope.createSampler = function (sampler, $event) {

      // remove invalid params pair
      _.remove(sampler.arguments, function (argument) {
        return (argument.paramName == '' || argument.paramValue == '');
      });

      if (sampler.arguments.length == 0) {
        sampler.arguments.push({
          "paramName": "",
          "paramValue": ""
        });
      }
      // validation for create sampler
      var $sampler_name = $('.sampler-form').find('.name-sampler');
      var $sampler_url = $('.sampler-form').find('.sampler-url');
      if (!$scope.selected.name && !$scope.selected.url) {
        $sampler_name.addClass('has-error');
        $sampler_name.focus();
        $sampler_url.addClass('has-error');
        return;
      } else if (!$scope.selected.name) {
        $sampler_name.addClass('has-error');
        $sampler_name.focus();
        return;
      } else if (!$scope.selected.url) {
        $sampler_url.addClass('has-error');
        $sampler_url.focus();
        return;
      }

      // add sampler into sampler list
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

    $scope.deleteSampler = function ($event, index) {
      $event.stopPropagation();
      $scope.script.samplers.splice(index, 1);
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
      $scope.createNewButton = true;
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
      $scope.createNewButton = true;
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

      $scope.createNewButton = false;
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

      ScriptService.get($scope.projectId, id, function (data, status) {
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