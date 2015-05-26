define(['fk/module'], function(module) {
  
  'use strict';
  module.registerController('ProviderCtrl',['$rootScope', '$scope', 'UserService', 'DataService', 
  	function ($rootScope, $scope, UserService, DataService) {
  		$scope.list = true;

  		UserService.spaces().then(function(spaces) {
      $scope.spaces = spaces;

      $scope.data = {};
          var tenant = $rootScope.context.tenant._id;

          DataService.list(tenant, null).then(function(response) {
            $scope.data.public = response;
          });

          var spaces = $scope.spaces;
          $(spaces).each(function() {
            var spaceName = this.name;
            var spaceId = this._id;
            DataService.list(tenant, spaceId).then(function(response) {
              $scope.data[spaceId] = response;
            });
          });
    });
  }]);

});