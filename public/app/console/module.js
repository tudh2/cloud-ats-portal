define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
], function(ng, couchPotato) {
  'use strict';

  var module = ng.module('app.console', ['ui.router']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.console', {
        url: '/console',
        views: {
          'content@app': {
            controller: 'ConsoleCtrl',
            templateUrl: 'app/console/views/console-view.tpl.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'console/controllers/console-controller',
                'services/console-service'
              ])
            }
          }
        },
        data: {
          title: 'Console',
          requireLogin: true
        }
      });
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
})