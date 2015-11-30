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
						controller: 'OverviewPerformanceCtrl',
						templateUrl: 'app/performance/views/overview.html',
						resolve: {
						deps: $couchPotatoProvider.resolveDependencies([
							'performance/controllers/overview-controller',
							'performance/directives/tabs-header-performance',
							'services/performance-service',
							'performance/directives/download-report-performance'
						])
					}
					},
				},
				data: {
					title: 'Performance Project Detail',
					requireLogin: true
				}
		})
		.state('app.performance.scripts', {
			url: '/scripts',
			views: {
				"content@app": {
					controller: 'ScriptsCtrl',
					templateUrl: 'app/performance/views/scripts.html',
					resolve: {
					deps: $couchPotatoProvider.resolveDependencies([
						'performance/controllers/scripts-controller',
						'performance/controllers/upload-script-controller',
						'performance/controllers/create-script-controller',
						'performance/directives/tabs-header-performance',
						'performance/directives/script-configuration',
						'services/script-service',
						'modules/forms/directives/input/smart-uislider'
					])
				}
				},
			},
			data: {
				title: 'Performance Project Detail',
				requireLogin: true
			}
		})
		.state('app.performance.execution', {
			url: '/execution',
			views: {
				"content@app": {
					controller: 'PerformanceExeCtrl',
					templateUrl: 'app/performance/views/execution.html',
					resolve: {
					deps: $couchPotatoProvider.resolveDependencies([
						'performance/controllers/performance-exe-controller',
						'performance/directives/tabs-header-performance',
						'services/script-service'
					])
				}
				},
			},
			data: {
				title: 'Performance Project Detail',
				requireLogin: true
			}
		})
    .state('app.performance.report', {
      url: '/job/:jobId',
      views: {
        "content@app": {
          controller: 'PerformanceReportCtrl',
          templateUrl: 'app/performance/views/performance-report.html',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'performance/controllers/performance-report-controller',
              'performance/directives/performance-report',
              'services/performance-service',
              'services/script-service',
              'services/report-service'
      	])}
        }
      },
      data: {
        title: 'Performance Test Report',
        requireLogin: true
      }
    })
    .state('app.performance.report.sampler', {
      url: '/sampler/:reportId/:index',
      params: {
      	index: '0'
      },
      views: {
        "content@app": {
          controller: 'PerformanceReportDetailCtrl',
          templateUrl: 'app/performance/views/performance-sampler-report.html',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'performance/controllers/performance-report-detail-controller',
              'services/report-service',
              'performance/directives/performance-report'
      	])}
        }
      },
      data: {
        title: 'Sampler Report',
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