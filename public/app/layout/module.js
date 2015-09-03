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
                'layout/directives/smart-projects-active',


              ])
            }
          }
        }
      });
    $urlRouterProvider.otherwise(function($injector, $location) {
      var $state = $injector.get("$state");
      $state.go('app.dashboard');
    });

    $urlRouterProvider.rule(function($injector, $location) {
        
      var path = $location.path();
      var hasTrailingSlash = path[path.length-1] === '/';

      if(hasTrailingSlash) {
        
        //if last charcter is a slash, return the same url without the slash  
        var newPath = path.substr(0, path.length - 1); 
        return newPath; 
      } 
      
    });
  }]);

  module.run(['$couchPotato', function($couchPotato) {
    module.lazy = $couchPotato;
  }]);

  return module;
})