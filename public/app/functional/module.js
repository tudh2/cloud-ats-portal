define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.functional', ['ui.router']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.functional', {
        url: '/project/functional/:id',
        views: {
          "content@app": {
            templateUrl: 'app/functional/views/functional-detail.html',
            controller: 'FunctionalDetailCtrl',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'functional/controllers/functional-detail-controller'
              ])
            }
          }
        },
        data: {
          title: 'Project Details',
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