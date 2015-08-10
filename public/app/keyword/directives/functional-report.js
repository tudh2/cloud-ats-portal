define(['keyword/module', 'lodash'], function(module, _) {
  'use strict';

	module.registerDirective('morrisStackedBarGraph', function(){
        return {
            restrict: 'E',
            replace: true,
            
            //templateUrl: 'app/keyword/views/report.tpl.html',
            link: function(scope, element){
            	var bar_data= [{
          x : 'Test Suite 1',
          P : 100,
          F : 10,
          S : 10
      }, {
          x : 'Test Suite 2',
          P : 100,
          F : 0,
          S : 0
      }, {
          x : 'Test Suite 3',
          P : 90,
          F : 10,
          S : 0
      }, {
          x : 'Test Suite 4',
          P : 90,
          F : 0,
          S : 10
      }]
                Morris.Bar({
                    element : element,
                    axes : true,
                    grid : true,
                    data : bar_data,
                    xkey : 'x',
                    ykeys : ['P', 'F', 'S'],
                    labels : ['Pass', 'Fail', 'Skip'],
                    barColors : ['#15ab9f','#ff4f51','#fbd601'],
                    stacked : true
                });

            }
        }
  	});
});
