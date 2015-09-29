define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {

  'use strict';

  var module = ng.module('app.projects', ['ui.router']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.projects', {
        url: '/projects',
        views: {
          "content@app": {
            templateUrl: 'app/projects/views/project-list.html',
            controller: 'ProjectsCtrl',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'projects/controllers/projects-controller',
                'projects/controllers/new-project-controller',
                'projects/directives/smart-popover',
                'services/keyword-service',
                'services/keyword-upload-service',
                'services/performance-service',
                'services/report-service'
              ])
            }
          }
        },
        data: {
          title: 'Project List',
          requireLogin: true
        }
      })
      .state('app.projects.type', {
        url: '/:type',
        params: {
          type: {
            value: null,
            squash: true
          }
        },
        views: {
          "content@app": {
            templateUrl: 'app/projects/views/project-list.html',
            controller: 'ProjectsCtrl'
          }
        }
      })
  });

  couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
})