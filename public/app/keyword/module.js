define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.keyword', ['ui.router']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.keyword', {
        url: '/project/keyword/:id/:tab',
        params: {
          tab: 'overview'
        },
        views: {
          "content@app": {
            templateUrl: 'app/keyword/views/keyword-detail.html',
            controller: 'KeywordDetailCtrl',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'keyword/controllers/keyword-detail-controller',
                'services/keyword-service',
                'services/case-service',
                'fk/directives/keywords',
                'fk/directives/keyword-params',
                'fk/directives/steps',
                'fk/directives/suites',
                'fk/directives/cases'
              ])
            }
          }
        },
        data: {
          title: 'Keyword Project Details',
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