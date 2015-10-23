define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource',
  'morris'
], function(ng, couchPotato) {
  "use strict";

  var module = ng.module('app.dashboard', ['ui.router', 'ngResource']);

  module.config(function ($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          "content@app": {
            controller: 'DashboardCtrl',
            templateUrl: 'app/dashboard/dashboard.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'dashboard/dashboard-controller',
                'services/keyword-service',
                'services/performance-service',
                'services/dashboard-service',
                'services/report-service',
                'services/script-service',
                'keyword/directives/functional-report',
                'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget'
              ])
            }
          }
        },
        data: {
          title: 'Dashboard',
          requireLogin: true
        }
      });
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
});