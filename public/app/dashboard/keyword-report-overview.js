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
              
              var draw = function (size,value,hideHover) {
                var graph = Morris.Bar({
                              element : element,
                              axes : true,
                              grid : true,
                              data : scope.data,
                              xkey : 'x',
                              ykeys : ['P', 'F', 'S'],
                              labels : ['Pass', 'Fail', 'Skip'],
                              barColors : ['#15ab9f','#ff4f51','#fbd601'],
                              hideHover : hideHover,
                              barSizeRatio : size,
                              stacked : true
                          });
                graph.setData(value);
              };

              scope.$watch('data', function(value) {
                if(value) {
                  switch(value.length) {
                    case 0 :
                    draw(0.4,value,'always');
                    break;
                    case 1 : 
                    draw(0.2,value,'auto');
                    break;

                    case 2 :
                    draw(0.40,value,'auto');
                    break;

                    default:
                    draw(0.75,value,'auto');
                    break;
                  }
                }
              }, true);
            }
        }
    })
})