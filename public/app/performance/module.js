define([
  'angular',
  'angular-couch-potato',
  'angular-ui-router',
  'angular-ui-ace',
  'angular-drag-and-drop-lists'
], function(ng, couchPotato) {

	'use strict';
	var module = ng.module('app.performance', ['ui.router', 'ui.ace', 'dndLists']);
  
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
							'services/performance-service'
						])
					}
					},
				},
				data: {
					title: 'Performance Project Overview',
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
						'performance/directives/tabs-header-performance',
						'services/script-service',
					])
				}
				},
			},
			data: {
				title: 'Scripts',
				requireLogin: true
			}
		})
    .state('app.performance.scripts.editor', {
      url: '/editor/:scriptId',
      views: {
        "content@app": {
          controller: 'ScriptEditorCtrl',
          templateUrl: 'app/performance/views/script-editor.html',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'performance/directives/configuration-script',
              'performance/controllers/script-editor-controller',
              'modules/forms/directives/input/smart-uislider'
            ])
          }
        }
      },
      data: {
        title: 'Script Editor',
        requireLogin: true
      }
    })
    .state('app.performance.scripts.wizard', {
      url: '/wizard?scriptId',
      views: {
        "content@app": {
          controller: 'ScriptWizardCtrl',
          templateUrl: 'app/performance/views/script-wizard.html',
          resolve: {
            deps: $couchPotatoProvider.resolveDependencies([
              'performance/controllers/script-wizard-controller',
              'performance/directives/configuration-script',
              'modules/forms/directives/input/smart-uislider'
            ])
          }
        }
      },
      data: {
        title: 'Script Creator',
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
				title: 'Execution',
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
      url: '/sampler/:reportId/:index/:hit/:tran',
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