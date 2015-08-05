define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';

  module.registerController('SuitesCtrl', [
    '$scope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 'SuiteService',
    function($scope, $stateParams, $templateRequest, $compile, CaseService, SuiteService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST SUITES';

      $scope.editMode = false;

      SuiteService.list($scope.projectId, function(response) {
        $scope.suites = response;

        CaseService.references($scope.projectId, function(response) {
          $scope.cases = response;
          if ($scope.suites.length > 0) $scope.selectSuite($scope.suites[0]);
        });
      });

      var loadTemplate = function() {
        var $container = $('#testcase-container');

        $templateRequest('app/keyword/views/testsuite-editable.tpl.html').then(function(template) {
          $container.html($compile(template)($scope));
          $container.fadeIn();
        });
      }

      $scope.checkExistingCase = function(caze) {
        var result = _.find($scope.current.cases, function(sel) {
          return sel._id === caze._id;
        });
        return result !== undefined;
      }

      var getCaseName = function(caze) {
        var result = _.find($scope.cases, function(sel) {
          return sel._id == caze._id;
        });

        return result.name;
      }

      $scope.selectSuite = function(suite) {

        //Inject case name
        _.forEach(suite.cases, function(caze) {
          caze.name = getCaseName(caze);
        });

        //Inject case outline
        var caseOutline = [];
        _.forEach($scope.cases, function(outCase) {
          var inCase = _.find(suite.cases, outCase);
          if (inCase === undefined) caseOutline.push(outCase);
        })
        suite.caseOutline = caseOutline;

        //Store backup case
        suite.originCases = _.cloneDeep(suite.cases);
        suite.originCaseOutline = _.cloneDeep(suite.caseOutline);

        $scope.current = suite;
        loadTemplate();
      }

      $scope.editSuite = function() {
        $scope.editMode = true;
        console.log($scope.current);
      }

      $scope.saveEditTestSuite = function() {

        if ($scope.current.temp)

        SuiteService.create($scope.projectId, $scope.current, function(data, status) {
          switch (status) {

            case 201: 
              $.smallBox({
                title: 'Notification',
                content: 'Your test case have created',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $scope.suites.push(data);
              $scope.cancelEditTestSuite();
              break;

            default:
              $.smallBox({
                title: 'Notification',
                content: 'Can not create your test case',
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });
          }
        });

        else {
          console.log($scope.current);
        }
      }

      $scope.cancelEditTestSuite = function() {
        $scope.editMode = false;
        if (!$scope.current.temp) {
          $scope.current.cases = _.cloneDeep($scope.current.originCases);
          $scope.current.caseOutline = _.cloneDeep($scope.current.originCaseOutline);
        } else {
          if ($scope.suites.length > 0) $scope.selectSuite($scope.suites[0]);
        }
      }

      $scope.inputNewSuiteNameBlur = function($event) {
        var element = $event.currentTarget;
        if ($scope.current.name === undefined || $scope.current.name === '' || $scope.current.name === null) {
          $(element).focus();
          $(element).addClass('state-error');
        }
      }

      $scope.inputNewSuiteNameKeypress = function($event) {
        var element = $event.currentTarget;
        $(element).removeClass('state-error');
      }

      $scope.clickSelectTestCase = function(event, caze) {
        if(!$scope.editMode && !$scope.current.temp) {
          return; 
        }

        var $inputSuiteName = $('#input-new-testsuite-name');
        if ($scope.current.name === undefined || $scope.current.name === '' || $scope.current.name === null) {
          $inputSuiteName.focus();
          $inputSuiteName.addClass('state-error');
          return false;
        }

        var $element = $(event.currentTarget);
        var existed = _.indexOf($scope.current.cases, caze);

        if (existed == -1) {
          _.remove($scope.current.caseOutline, function(e) {
            return e._id == caze._id;
          });
          $scope.current.cases.push(caze);
          $element.addClass('test-case-selected');
        } else {
          _.remove($scope.current.cases, function(e) {
            return e._id == caze._id;
          });
          $scope.current.caseOutline.push(caze);
          $element.removeClass('test-case-selected');
        }

        loadTemplate();
      }

      $scope.clickNewTestSuiteButton = function () {
        
        if ($scope.current !== undefined && $scope.current.temp) return;

        $scope.current = {
          "name": undefined,
          "cases": [],
          "caseOutline": _.cloneDeep($scope.cases),
          "temp": true,
        };

        $scope.editMode = false;
        loadTemplate();
      };


    }]);
});