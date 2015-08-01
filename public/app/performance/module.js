define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router'
], function(ng, couchPotato) {

	'use strict';
	var module = ng.module('app.performance', ['ui.router']);
  
	module.config(function ($stateProvider, $couchPotatoProvider) {

		$stateProvider
			.state('app.performance', {
				url: '/project/performance/:id',
				views: {
					"content@app": {
						controller: 'PerformanceDetailCtrl',
						templateUrl: 'app/performance/views/performance-detail.html',
						resolve: {
						deps: $couchPotatoProvider.resolveDependencies([
							'performance/controllers/performance-detail-controller',
							'modules/forms/directives/input/smart-uislider',
							'services/performance-service'
						])
					}
					},
				},
				data: {
					title: 'Performance Project Detail',
					requireLogin: true
				}
			});
	});
	couchPotato.configureApp(module);

  module.run(function($couchPotato) {
    module.lazy = $couchPotato;
  });

  return module;
});