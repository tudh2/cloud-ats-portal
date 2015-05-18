define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource'
], function(ng, couchPotato) {
  'use strict';

  var module = ng.module('app.fk', ['ui.router', 'ngResource']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.fk', {
        url: '/fk',
        views: {
          "content@app": {
            controller: 'FKCtrl',
            templateUrl: 'app/fk/fk.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/fk-controller'
              ])
            }
          }
        },
        data: {
          title: 'Keyworks Framework',
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