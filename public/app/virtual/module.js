define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource'
], function(ng, couchPotato) {
  'use strict';

  var module = ng.module('app.virtual', ['ui.router', 'ngResource']);

  module.config(function($stateProvider, $couchPotatoProvider) {
    $stateProvider
      .state('app.virtual', {
                url: '/vm',
                data: {
                    title: 'Virtual Machine',
                    requireLogin: true
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/virtual/views/virtual.html',
                        controller: 'VirtualCtrl',
                        resolve: {
                            projects: function($http){
                                return $http.get('api/test-virtual-machine.json')
                            },
                            deps: $couchPotatoProvider.resolveDependencies([
                                'virtual/controllers/virtual-controller',
                                'services/virtual-service',
                                'modules/graphs/directives/inline/sparkline-container',
                                'modules/tables/directives/datatables/datatableBasic'
                                
                            ])
                        }
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