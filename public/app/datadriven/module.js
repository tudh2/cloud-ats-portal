define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.datadriven', ['ui.router']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.datadriven', {
        url: '/datas',
        views: {
          "content@app": {
            controller: 'DataCtrl',
            templateUrl: 'app/datadriven/views/data-driven.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'datadriven/controllers/data-controller',
                'services/case-service',
                'datadriven/directives/data-provider-table'
              ])
            }
          }
        },
        data: {
          title: 'Data Driven List',
          requireLogin: true
        }
      })
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
})