define(['performance/module', 'notification'], function (module) {
  
  'use strict';

  module.registerController('CreateScriptCtrl', ['$scope', '$stateParams', 'PerformanceService', 'ScriptService', function($scope, $stateParams, PerformanceService, ScriptService) {

    $scope.samplers = [

    ];

    $scope.selected = {
      method: 'get',
      constantTime: '0',
      params: [{

      }]
    };

    $scope.clickSaveScript = function () {
      ScriptService.initScript($scope.script.name,$stateParams.id,  function (response) {
        if (response != null) {
          $scope.script._id = response._id;
          $.smallBox({
            title: "The script has created",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#5F895F",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });

          $scope.scripts.push(response);
        }
      });
    }

    $scope.createSampler = function (sampler) {

      $scope.samplers.push(sampler);
      console.log($scope.samplers);
    }

    $scope.resetSamplerForm = function () {

      $scope.selected = {
        method: 'get',
        constantTime: '0',
        params: [{

          }]
      };
    }

    $scope.chooseSampler = function (i, index) {

      $scope.selected = i;
      $scope.selected.index = index;
    }
    $scope.clickUploadScriptButton = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '20px');
    };

    $scope.clickCreateScriptButton = function () {
      var $id = $('#createScript').find('.nav.nav-tabs .active a').attr('id');
      if ($id === 'samplersId') {
        changeModalSize();
      } else if ($id === 'basicId' || $id === 'configurationId') {
        resetModalSize();
      }

    };

    $scope.newSampler = function () {
      changeModalSize();
    };

    $scope.basic = function () {
      resetModalSize();
    };

    $scope.configuration = function () {
      resetModalSize();
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
  }]);

});