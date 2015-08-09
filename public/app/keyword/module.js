define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-dragdrop'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.keyword', ['ui.router', 'ngDragDrop']);

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
              'services/keyword-service',
              'services/event-service'
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
              'keyword/directives/keywords',
              'keyword/directives/keyword-params',
              'keyword/directives/steps',
              'keyword/directives/ng-draggable',
              'modules/forms/directives/input/smart-xeditable',
              'services/case-service',
              'services/custom-keyword-service'
            ])
          }
        }
      }
    })
    .state('app.keyword.driven', {
      url: '/driven',
      views: {
        'content@app': {
          templateUrl: 'app/keyword/views/datadriven.html',
          controller: 'DrivenCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/driven-controller',
              'keyword/directives/tabs-header',
              'services/case-service'
            ])
          }
        }
      }
    })
    .state('app.keyword.suites', {
      url: '/suites',
      views: {
        'content@app': {
          templateUrl: 'app/keyword/views/testsuite.html',
          controller: 'SuitesCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/suites-controller',
              'keyword/directives/tabs-header',
              'services/case-service',
              'services/suite-service'
            ])
          }
        }
      }
    })
    .state('app.keyword.execution', {
      url: '/execution',
      views: {
        'content@app': {
          templateUrl: 'app/keyword/views/execution.html',
          controller: 'ExecutionCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/execution-controller',
              'keyword/directives/tabs-header',
              'services/suite-service',
              'services/keyword-service'
            ])
          }
        }
      }
    })
    .state('app.keyword.custom', {
      url: '/custom',
      views: {
        'content@app': {
          templateUrl: 'app/keyword/views/custom.html',
          controller: 'CustomCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'keyword/controllers/custom-controller',
              'keyword/directives/tabs-header',
              'services/custom-keyword-service',
              'keyword/directives/keywords',
              'keyword/directives/keyword-params',
              'keyword/directives/steps'
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