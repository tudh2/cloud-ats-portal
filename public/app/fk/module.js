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
            templateUrl: 'app/fk/fk.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/fk-controller',
                'fk/directives/data-provider-form',
                'fk/directives/data-provider-table',
                'fk/directives/keywords',
                'fk/directives/keyword-params',
                'fk/directives/steps',

                'services/keyword-service',
                
                'modules/forms/common',
                'modules/forms/directives/validate/smart-validate-form',
                'modules/forms/directives/wizard/smart-wizard',
                'modules/forms/directives/input/smart-xeditable',
                'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget'
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
            templateUrl: 'app/fk/data-provider.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/provider-controller',
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-select2',
                'fk/directives/data-provider-table',
                'fk/directives/tick-box',
                'modules/forms/directives/input/smart-xeditable',
                'fk/directives/data-delete'

              ])
            }
          }
        },
        data: {
          title: 'Data Provider',
          requireLogin: true
        }
      }).state('app.newdata', {
        url: '/newdata',
        views: {
          "content@app": {
            controller: 'ProviderCtrl',
            templateUrl: 'app/fk/new-data-provider.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'fk/provider-controller',
                'modules/forms/directives/input/smart-xeditable',
                'fk/directives/data-provider-table',
                'fk/directives/data-provider-form',
                'fk/directives/new-data-provider-form',
                'modules/forms/common',
                'modules/forms/directives/validate/smart-validate-form',
                'modules/forms/directives/wizard/smart-wizard',
                'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-select2'

              ])
            }
          }
        },
        data: {
          title: 'New data provider',
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