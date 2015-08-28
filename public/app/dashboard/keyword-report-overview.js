define(['dashboard/module', 'lodash'], function(module, _) {
	'use strict';
	 module.registerDirective('morrisStackedBarGraph', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
              data: '='
            },
            template: '<div class="chart no-padding"></div>',
            link: function(scope, element){
              var graph = Morris.Bar({
                              element : element,
                              axes : true,
                              grid : true,
                              data : scope.data,
                              xkey : 'x',
                              ykeys : ['P', 'F', 'S'],
                              labels : ['Pass', 'Fail', 'Skip'],
                              barColors : ['#15ab9f','#ff4f51','#fbd601'],
                              hideHover : true,
                              stacked : true
                          });

              scope.$watch('data', function(value) {
                if(value) {
                  graph.setData(value);
                }
              }, true);
            }
        }
    })
})