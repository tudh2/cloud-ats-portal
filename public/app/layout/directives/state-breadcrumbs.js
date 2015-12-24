define(['layout/module'], function (module) {

  'use strict';
                                                 
  module.registerDirective('stateBreadcrumbs', ['$rootScope', '$compile', '$state', '$stateParams', 
    function($rootScope, $compile, $state, $stateParams) {

    return {
      restrict: 'E',
      replace: true,
      template: '<ol class="breadcrumb"><li>Home</li></ol>',
      link: function(scope, element) {
        function setBreadcrumbs(breadcrumbs) {
          var html = '';
          angular.forEach(breadcrumbs, function(crumb) {
            html += '<li><a href="#" data-ui-sref="'+crumb.name+'">{{getWord("'+crumb.title+'")}}</a></li>';
          });

          element.html($compile(html)(scope));  
        }

        function fetchBreadcrumbs(stateName, breadcrumbs) {
          var state = $state.get(stateName);
          if (state && state.data && state.data.title && breadcrumbs.indexOf(state.data.title) == -1) {
            breadcrumbs.unshift({
              'title': state.data.title,
              'name': state.name
            });
          }

          var parentName = stateName.replace(/.?\w+$/, '');
          if (parentName) {
            return fetchBreadcrumbs(parentName, breadcrumbs);
          } else {
            return breadcrumbs;
          }
        }

        function processState(state) {
          var breadcrumbs;
          if (state.data && state.data.breadcrumbs) {
            breadcrumbs = state.data.breadcrumbs;
          } else {
            breadcrumbs = fetchBreadcrumbs(state.name, []);
          }
          setBreadcrumbs(breadcrumbs);
        }

        processState($state.current);

        $rootScope.$on('$stateChangeStart', function(event, state, params) {
          processState(state);
        });
      }
    };
  }]);

});