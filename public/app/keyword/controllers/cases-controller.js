define(['keyword/module', 'lodash'], function (module, _) {

  'use strict';

  module.registerController('CasesCtrl', [
    '$rootScope','$scope', '$state','$stateParams', '$templateRequest', '$compile', 'CaseService', 'CustomKeywordService', 
    function($rootScope,$scope, $state, $stateParams, $templateRequest, $compile, CaseService, CustomKeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'TEST CASES';

      CaseService.list($scope.projectId, function(response) {
        $scope.cases = response;
      });


      CustomKeywordService.list($scope.projectId, function(response) {
        $scope.customs = response;
      });

      var loadModal = function() {
        var $modal = $('#editCase');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/testcase-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });

        $modal.on('hidden.bs.modal', function() {
          if (!$scope.current.saved) {
            $scope.current.steps = _.cloneDeep($scope.current.originSteps);
            $scope.current.name = $scope.current.originName;
          }
        });
      }

      $scope.addCustomKeyword = function (customKeywordName, caze) {
        var $input = $('input[name="customKeywordName"]');
        $scope.customAdded =true;
        $scope.customMode = false;
        if (customKeywordName === undefined || customKeywordName === null || customKeywordName === '') {
          $input.focus();
          $input.addClass('state-error');
        } else {
          $input.removeClass('state-error');
          var customKeyword = { name : customKeywordName, steps : _.cloneDeep(caze.steps)};
          CustomKeywordService.create($scope.projectId, customKeyword, function(data, status) {
            caze.customMode = false;
            caze.customAdded = true;
            $scope.customs.push(data);
            $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your test case has been created'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
            });
          });
        }
      }


      $scope.toCustomKeywordList = function() {
        $state.go('app.keyword.custom', { id : $scope.projectId });
        $scope.customAdded = true;
        $scope.customMode = true;
      }

      $scope.newTestCase = function() {
        $scope.current = {
          "name": "New Test Case",
          "steps": [],
          "temp": true
        };

        loadModal();        
      };

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

      $scope.save = function() {

        $scope.current.saved = true;

        if ($scope.current.temp) {
          CaseService.create($scope.projectId, $scope.current, function(data, status) {
            
            switch (status) {

            case 201: 
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your test case has been created'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $scope.cases.push(data);
              break;

            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not create your test case'),
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

            }
          });

        } else {
          var params = buildParamList($scope.current);
          if(params.length == 0) $scope.current.data_driven = null;
          
          CaseService.update($scope.projectId, $scope.current, function(data, status) {
            switch (status) {
              case 200:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test case has been updated'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              case 204:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Your test case has nothing to update'),
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              default:
                $.smallBox({
                  title: $rootScope.getWord('Notification'),
                  content: $rootScope.getWord('Can not update your test case'),
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
            }
          });
        }


        $('#editCase').modal('hide');
      }

      $scope.removeCase = function() {
        if (!$scope.current.temp) {
          CaseService.delete($scope.projectId, $scope.current._id, function(data, status) {
            switch (status) {

            case 200: 
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your test case has been deleted'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              _.remove($scope.cases, function(sel) {
                return sel._id == $scope.current._id;
              });
              break;

            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not delete your test case'),
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

            }
          });
        }
      }

      $scope.clickToCase = function(caze) {
        caze.customMode = false;
        caze.customAdded = false;
        caze.saved = false;
        caze.originSteps = _.cloneDeep(caze.steps);
        caze.originName = caze.name;

        $scope.current = caze;
        loadModal();
      } 

  }]);

});