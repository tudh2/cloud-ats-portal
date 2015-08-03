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
      url: '/project/keyword/:id',
      views: {
        "content@app": {
          templateUrl: 'app/keyword/views/overview.html',
          controller: 'OverviewCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/overview-controller',
              'keyword/directives/tabs-header',
              'services/keyword-service'
            ])
          }
        }
      },
      data: {
        title: 'Keyword Project Details',
        requireLogin: true
      }
    })
    .state('app.keyword.cases', {
      url: '/cases',
      views: {
        'content@app': {
          templateUrl: 'app/keyword/views/testcase.html',
          controller: 'CasesCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/cases-controller',
              'keyword/directives/tabs-header',
              'services/case-service',
              'fk/directives/keywords',
              'fk/directives/keyword-params',
              'fk/directives/steps',
              'fk/directives/suites',
              'fk/directives/cases'
            ])
          }
        }
      }
    });
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
})