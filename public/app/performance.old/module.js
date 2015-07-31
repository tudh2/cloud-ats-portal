define([
	'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-resource'
 	], function (ng, couchPotato) {
		'use strict';
		var module = ng.module('app.performance', ['ui.router', 'ngResource']);

		module.config(function ($stateProvider, $couchPotatoProvider) {

			$stateProvider.state('app.performance', {

				url: '/performance',
				views: {
					'content@app': {

						controller: 'PerformanceCtrl',
						templateUrl: 'app/performance/views/performance.html',
						resolve: {

							deps: $couchPotatoProvider.resolveDependencies([
								'performance/controllers/performance-controller',
								'performance/directives/new-performance-test-wizard',
								'performance/directives/wizard-samplers',
								'modules/widgets/directives/widget-grid',
                'modules/widgets/directives/jarvis-widget',
                'modules/forms/directives/input/smart-uislider',
                'modules/forms/directives/validate/smart-validate-form',
                'modules/forms/directives/wizard/smart-wizard',
                'modules/graphs/directives/inline/sparkline-container'
							])
						}
					}
				},

				data: {
					title: 'Performance Test',
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