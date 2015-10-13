define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-cookies'
], function(ng, couchPotato) {
  "use strict";

  var module = ng.module('app.auth', ['ui.router', 'ngCookies']);

  couchPotato.configureApp(module);

  module.config(['$stateProvider', '$couchPotatoProvider', function($stateProvider, $couchPotatoProvider) {
    $stateProvider.state('login', {
      url: '/login',
      views: {
        root: {
          templateUrl: 'app/auth/views/login.html'
        }
      },
      data: {
        title: 'Login',
        htmlId: 'extr-page'
      },
      resolve: {
        deps: $couchPotatoProvider.resolveDependencies([
          'auth/controllers/login-controller',
          'auth/directives/login-form'
        ])
      }
    }).state('register',{
      url: '/register',
      views: {
        root: {
          templateUrl: 'app/auth/views/register.html'
        }
      },
      data: {
        title: 'Register',
        htmlId: 'extr-page'
      },
      resolve: {
        deps: $couchPotatoProvider.resolveDependencies([
          'auth/controllers/register-controller',
          'auth/controllers/login-controller',
          'auth/directives/email-validate',
          'auth/directives/form-validate',
          'auth/directives/tenant-validate',
          'auth/directives/password-validate'
        ])
      }
    }).state('403',  {
      url: '/403.html',
      views: {
        root: {
          templateUrl: 'app/auth/views/errors/403.html'
        }
      },
      data: {
        title: 'Forbidden',
        htmlId: 'extr-page'
      }
    }).state('401',  {
      url: '/401.html',
      views: {
        root: {
          templateUrl: 'app/auth/views/errors/401.html'
        }
      },
      data: {
        title: 'Unauthorized',
        htmlId: 'extr-page'
      }
    })
  }]);

  module.run(['$couchPotato', function($couchPotato){
    module.lazy = $couchPotato;
  }]);

  return module;
});
