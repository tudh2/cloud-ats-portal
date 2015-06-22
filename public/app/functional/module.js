define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource',
  'angular-dragdrop'
], function(ng, couchPotato) {
  'use strict';

  var module = ng.module('app.functional', ['ui.router', 'ngResource']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.functional', {
        url: '/functional',
        views: {
          "content@app": {
            controller: 'FunctionalCtrl',
            templateUrl: 'app/functional/views/functional.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'functional/controllers/functional-controller',
                'services/functional-service',
                'services/data-service',
                'modules/ui/directives/smart-html-popover',
                'modules/forms/common',
                'modules/forms/directives/upload/smartDropzone',
                'modules/forms/directives/wizard/smart-wizard',
                'modules/forms/directives/input/smart-xeditable',
                'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-select2',
              ])
            }
          }
        },
        data: {
          title: 'Functional Test',
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