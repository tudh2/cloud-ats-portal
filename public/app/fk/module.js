define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource',
  'angular-dragdrop'
], function(ng, couchPotato) {
  'use strict';

  var module = ng.module('app.fk', ['ui.router', 'ngResource', 'ngDragDrop']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.fk', {
        url: '/fk',
        views: {
          "content@app": {
            controller: 'FKCtrl',
            templateUrl: 'app/fk/views/fk.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/controllers/fk-controller',
                'fk/directives/data-provider-table',
                'fk/directives/keywords',
                'fk/directives/keyword-params',
                'fk/directives/steps',

                'services/keyword-service',
                'modules/ui/directives/smart-html-popover',
                'modules/forms/common',
                'modules/forms/directives/validate/smart-validate-form',
                'modules/forms/directives/wizard/smart-wizard',
                'modules/forms/directives/input/smart-xeditable',
                'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-select2',
                'fk/directives/ui-if'
              ])
            }
          }
        },
        data: {
          title: 'Keyworks Framework',
          requireLogin: true
        }
      }).state('app.provider', {

        url: '/provider',
        views: {
          "content@app": {
            controller: 'ProviderCtrl',
            templateUrl: 'app/fk/views/data-provider.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/controllers/provider-controller',
                'fk/directives/data-provider-table',
                'fk/directives/tick-box',
                'fk/directives/new-data-provider-form',
               
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-select2',
                'modules/forms/directives/input/smart-xeditable'
              ])
            }
          }
        },
        data: {
          title: 'Data Provider',
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