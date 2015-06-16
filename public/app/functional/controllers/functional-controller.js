define(['functional/module', 'lodash'], function(module, _) {

  'use strict';

  module.registerController('FunctionalCtrl', ['$scope','FunctionalService',function($scope,functionalService) {

  		$scope.upload = function() {
  			console.log($scope.file);
  			functionalService.upload($scope.file,function(data){

  			});
  		}

  		$scope.uploadedFile = function(element) {
		   $scope.file = element.files[0];
		}
    }
  ]);

});