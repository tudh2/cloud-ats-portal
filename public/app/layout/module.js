define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {
  "use strict";

  var module = ng.module('app.layout', ['ui.router']);

  couchPotato.configureApp(module);

  module.config(['$stateProvider', '$couchPotatoProvider', '$urlRouterProvider',
    function ($stateProvider, $couchPotatoProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'app/layout/layout.tpl.html',
            resolve: {
              deps: $couchPotatoProvider.resolveDependencies([
                'auth/directives/login-info',
                'auth/controllers/logout-controller',

                'layout/actions/minify-menu',
                'layout/actions/toggle-menu',
                'layout/actions/full-screen',
                'layout/actions/reset-widgets',

                'layout/directives/list-space',
                'layout/directives/smart-menu',
                'layout/directives/state-breadcrumbs',
                'layout/directives/search-autocomplete',

                'components/activities/activities-controller',
                'components/activities/activities-service',
                'components/activities/activities-dropdown-toggle-directive',
                'components/shortcut/toggle-shortcut',

                'components/language/Language',
                'components/language/language-selector',
                'components/language/language-controller',
              ])
            }
          }
        }
      });
    $urlRouterProvider.otherwise(function($injector, $location) {
      var $state = $injector.get("$state");
      $state.go('app.dashboard');
    });
  }]);

  module.run(['$couchPotato', function($couchPotato) {
    module.lazy = $couchPotato;
  }]);

  return module;
})