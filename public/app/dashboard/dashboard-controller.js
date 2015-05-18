define(['dashboard/module', 'lodash'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['AuthenticationService',
    function(AuthenticationService) {
      AuthenticationService.verifyState('app.dashboard');
  }]);

});