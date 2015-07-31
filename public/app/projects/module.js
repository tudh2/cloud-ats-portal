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
                'projects/directives/smart-popover',
                'services/keyword-service'
              ])
            }
          }
        },
        data: {
          title: 'Project List',
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