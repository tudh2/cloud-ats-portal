define(['auth/module'], function(module) {
  'use strict';

  return module.registerController('LoginCtrl', ['$scope', '$cookies', '$state', '$window', '$rootScope', 'AuthenticationService', LoginCtrl]);

  function LoginCtrl($scope, $cookies, $state, $window, $rootScope, AuthenticationService) {
    $scope.email = '';
    $scope.password = '';


    $scope.submit = function() {

      var expires = new Date();
      expires.setDate(expires.getDate() + 365);
      if ($scope.email != '' && $scope.password != '') {

        AuthenticationService.login($scope.email, $scope.password, function(data) {
          if (data.error) {
            $scope.message = data.message;          
          } else {
            $cookies.put('authToken', data.authToken, {
              expires: expires
            });

            AuthenticationService.context().then(function(context) {
              $window.sessionStorage.setItem('context', JSON.stringify(context));
              $rootScope.context = context;
              $state.go('app.dashboard');
            });
          }
        });
      }
	   /*var mockContext = {"user":{"_id":"haint@cloud-ats.net","first_name":"Hai","last_name":"Nguyen","created_date":{"$date"
:"2015-06-30T06:22:08.588Z"},"active":true,"password":"12345","tenant":{"_id":"Fsoft"},"spaces":[{"_id"
:"eed54048-db71-4193-8278-48847666de58"}],"roles":null},"tenant":{"_id":"Fsoft","created_date":{"$date"
:"2015-06-30T06:22:08.558Z"},"active":true,"features":null}};
		$window.sessionStorage.setItem('context', JSON.stringify(mockContext));
      $rootScope.context = mockContext;
      $state.go('app.dashboard');
<<<<<<< HEAD
	  */
    }
  }
});