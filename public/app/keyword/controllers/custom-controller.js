define(['keyword/module'], function (module) {

  'use strict';

  module.registerController('CustomCtrl', [
    '$scope', '$state', '$stateParams', '$templateRequest', '$compile','CustomKeywordService', 
    function($scope, $state, $stateParams, $templateRequest, $compile,CustomKeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'CUSTOM KEYWORDS';

      $scope.backToCaseList = function() {
        $state.go('app.keyword.cases', {id : $scope.projectId});
      }

      CustomKeywordService.list($scope.projectId, function(response) {
        $scope.customs = response;
      });

      var loadModal = function() {
        var $modal = $('#editKeyword');

        //clear modal content
        $modal.html('');
        $templateRequest('app/keyword/views/customkeyword-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
        });
      }

      $scope.newCustomKeyword = function() {
        $scope.currentCustomKeyword = {
          "name": "New Custom Keyword",
          "steps": [],
          "temp": true
        };

        loadModal();    
      }

      $scope.removeDivAddCustom = function() {
        $('div.add-keyword').hide();
      }

      $scope.clicktoCustom = function (customKeyword) {
        $scope.currentCustomKeyword = customKeyword;
        loadModal();
      }

      $scope.removeCustom = function() {
        if (!$scope.currentCustomKeyword.temp) {
          CustomKeywordService.delete($scope.projectId, $scope.currentCustomKeyword._id, function(data, status) {
            switch (status) {

            case 200: 
              $.smallBox({
                title: 'Notification',
                content: 'Your test case has deleted',
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              _.remove($scope.customs, function(sel) {
                return sel._id == $scope.currentCustomKeyword._id;
              });
              break;

            default:
              $.smallBox({
                title: 'Notification',
                content: 'Can not delete your test case',
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

            }
          });
        }
      }

      $scope.save = function (customKeywordName, customKeyword) {

        if ($scope.currentCustomKeyword.temp) {
          var $input = $('input[name="customKeywordName"]');
          if (customKeywordName === undefined || customKeywordName === null || customKeywordName === '') {
            $input.focus();
            $input.addClass('state-error');
          } else {
            $input.removeClass('state-error');
            var customKeyword = { name : customKeywordName, steps : _.cloneDeep(customKeyword.steps)};
            CustomKeywordService.create($scope.projectId, customKeyword, function(data, status) {
              
              switch (status) {

              case 201: 
                $.smallBox({
                  title: 'Notification',
                  content: 'Your custom keyword has created',
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                $scope.customs.push(data);
                break;

              default:
                $.smallBox({
                  title: 'Notification',
                  content: 'Can not create your custom keyword',
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });

              }
            });
          }

        } else {
          CustomKeywordService.update($scope.projectId, $scope.currentCustomKeyword, function(data, status) {
            switch (status) {
              case 200:
                $.smallBox({
                  title: 'Notification',
                  content: 'Your custom keyword has updated',
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              case 204:
                $.smallBox({
                  title: 'Notification',
                  content: 'Your custom keyword has nothing to update',
                  color: '#296191',
                  iconSmall: 'fa fa-check bounce animated',
                  timeout: 3000
                });
                break;
              default:
                $.smallBox({
                  title: 'Notification',
                  content: 'Can not update your test case',
                  color: '#c26565',
                  iconSmall: 'fa fa-ban bounce animated',
                  timeout: 3000
                });
            }
          });
        }

      }


  }]);

});