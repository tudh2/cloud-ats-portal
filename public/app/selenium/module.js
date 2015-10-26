define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-x-editable'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.selenium', ['ui.router', 'xeditable']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
    .state('app.selenium', {
      url: '/project/selenium/:id',
      views: {
        "content@app": {
          templateUrl: 'app/selenium/views/overview.html',
          controller: 'OverviewUploadCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'selenium/controllers/overview-upload-controller',
              'selenium/directives/tabs-header',
              'services/selenium-upload-service',
              'selenium/directives/download-report',
              'services/event-service'
            ])
          }
        }
      },
      data: {
        title: 'Selenium Project Detail',
        requireLogin: true
      }
    }).state('app.selenium.execution', {
      url: '/execution',
      views: {
        'content@app': {
          templateUrl: 'app/selenium/views/execution.html',
          controller: 'ExecutionUploadCtrl',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'selenium/controllers/execution-controller',
              'selenium/directives/tabs-header',
              'services/selenium-upload-service'
            ])
          }
        }
      }
    });
    
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato, editableOptions, editableThemes) {
    module.lazy = $couchPotato;
  });

  return module;
})