define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';

  module.registerController('SuitesCtrl', [
    '$rootScope','$scope', '$stateParams', '$templateRequest', '$compile', 'CaseService', 'SuiteService',
    function($rootScope,$scope, $stateParams, $templateRequest, $compile, CaseService, SuiteService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST SUITES';

      $scope.editMode = false;

      $scope.oldNameSuite = '';

<<<<<<< HEAD
=======
      var checkCharacterName = /[a-zA-Z0-9\_\s]+/;

      var checkFirstCharacterName = /^[a-zA-Z\_]/;


>>>>>>> Validate name suite
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

      var getCaseName = function(caze) {
        var result = _.find($scope.cases, function(sel) {
          return sel._id == caze._id;
        });

        return result.name;
      }

      $scope.checkExistingCase = function(caze) {
        var result = _.find($scope.current.cases, function(sel) {
          return sel._id === caze._id;
        });
        return result !== undefined;
      }

      $scope.selectSuite = function(suite) {

        //Inject case name
        _.forEach(suite.cases, function(caze) {
          caze.name = getCaseName(caze);
        });

        //Inject case outline
        var caseOutline = [];
        _.forEach($scope.cases, function(outCase) {
          var inCase = _.find(suite.cases, function (caze) {
            return outCase._id === caze._id;
          });
          if (inCase === undefined) caseOutline.push(outCase);
        })
        suite.caseOutline = caseOutline;

        //Store backup case
        suite.originCases = _.cloneDeep(suite.cases);
        suite.originCaseOutline = _.cloneDeep(suite.caseOutline);

        $scope.current = suite;
        loadTemplate();
      }

      $scope.deleteTestSuite = function(suite) {

        SuiteService.delete($scope.projectId, suite._id, function(data, status) {

            switch (status) {

              case 200: 
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test suite has deleted'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                _.remove($scope.suites, function(sel) {
                  return sel._id === suite._id;
                });
                if ($scope.suites.length > 0) $scope.selectSuite($scope.suites[0]);
                else $scope.current = [];
                break;

              default:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Can not delete your test suite'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
            }
          });
      }

      $scope.clickEditName = function(value) {
        $scope.editMode = true;
        $scope.oldNameSuite = value.name;
      }

      $scope.saveEditTestSuite = function() {

        if ($scope.current.temp) {

          var $inputSuiteName = $('#input-new-testsuite-name');
          if ($scope.current.name === undefined || $scope.current.name === '' || $scope.current.name === null) {
            $inputSuiteName.focus();
            $inputSuiteName.addClass('state-error');
            return false;
          }

          if (checkFirstCharacterName.exec($scope.current.name) == null) {
            $inputSuiteName.focus();
            $inputSuiteName.parent().addClass('has-error');
            return;
          } else {
            var chars = checkCharacterName.exec($scope.current.name);
            if (chars[0].length != $scope.current.name.length) {
              $inputSuiteName.focus();
              $inputSuiteName.parent().addClass('has-error');
              return;
            }
          }

          SuiteService.create($scope.projectId, $scope.current, function(data, status) {
            switch (status) {

              case 201: 
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test suite has created'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                $scope.suites.push(data);
                $scope.selectSuite(data);
                break;

              case 304:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('This name already exists. Please try again'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
                break;

              default:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Can not create your test suite'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
            }
          });

        } else {
          var new_name = $scope.current.name;
          var input_new_name = $('input[id="editNameSuite"]').parent();
          if(new_name.trim().length == 0) {
            input_new_name.addClass("has-error");
            return;
          } else if(new_name.trim().length > 0) {
            input_new_name.removeClass("has-error");
          }

          if (checkFirstCharacterName.exec(new_name) == null) {
            input_new_name.focus();
            input_new_name.addClass('has-error');
            return;
          } else {
            var chars = checkCharacterName.exec(new_name);
            if (chars[0].length != new_name.length) {
              input_new_name.focus();
              input_new_name.addClass('has-error');
              return;
            }
          }

          SuiteService.update($scope.projectId, $scope.current, function(data, status) {
            switch (status) {

              case 200: 
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test suite has updated'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                $scope.editMode = false;
                break;

              case 204: 
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test suite has nothing to date'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                $scope.editMode = false;
                break;

              case 304:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('This name already exists. Please try again'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
                break;

              default:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Can not update your test suite'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
            }
          });
        }
      }

      $scope.cancelEditTestSuite = function() {
        $scope.editMode = false;
        $scope.current.name = $scope.oldNameSuite;
        if (!$scope.current.temp) {
          $scope.current.cases = _.cloneDeep($scope.current.originCases);
          $scope.current.caseOutline = _.cloneDeep($scope.current.originCaseOutline);
        } else {
          $scope.current = undefined;
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
        
        if ($scope.current !== undefined && $scope.current.temp || $scope.editMode) return;

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