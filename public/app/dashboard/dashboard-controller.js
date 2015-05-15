define(['dashboard/module', 'lodash'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
      
      var tenant = $rootScope.context.tenant._id.toLowerCase();

      if (!$stateParams.tenant || tenant != $stateParams.tenant) {
        $state.go('app.dashboard', { tenant : tenant });
      }
  }]);

});