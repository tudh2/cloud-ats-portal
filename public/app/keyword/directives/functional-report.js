define(['keyword/module', 'lodash'], function(module, _) {
  'use strict';

	module.registerDirective('morrisStackedBarGraph', ['$rootScope',function($rootScope){
          return {
              restrict: 'E',
              replace: true,
              scope: {
                data: '=',
                lang: "="
              },
              template: '<div class="chart no-padding"></div>',
              link: function(scope, element){

                var pass = "Pass";
                var fail = "Fail";
                var skip = "Skip";

                var draw = function (size,value,hideHover,pass,fail,skip) {
                  var graph = Morris.Bar({
                                element : element,
                                axes : true,
                                grid : true,
                                data : scope.data,
                                xkey : 'x',
                                ykeys : ['P', 'F', 'S'],
                                labels : [pass, fail, skip],
                                barColors : ['#15ab9f','#ff4f51','#fbd601'],
                                hideHover : hideHover,
                                barSizeRatio : size,
                                stacked : false
                            });
                  graph.setData(value);
                };

                var optionsDraw = function(value) {
                  if(value) {
                    switch(value.length) {
                      case 0 :
                      draw(0.4,value,'always',pass,fail,skip);
                      break;
                      case 1 : 
                      draw(0.2,value,'auto',pass,fail,skip);
                      break;
  
                      case 2 :
                      draw(0.40,value,'auto',pass,fail,skip);
                      break;
  
                      default:
                      draw(0.75,value,'auto',pass,fail,skip);
                      break;
                    }
                  }
                };

                scope.$watch('data', function(value) {
                  optionsDraw(value);
                }, true);

                scope.$watch("lang", function(value) {
                  if($rootScope.getWord !== undefined) {
                    pass = $rootScope.getWord("Pass");
                    fail = $rootScope.getWord("Fail");
                    skip = $rootScope.getWord("Skip");

                    optionsDraw(scope.data);
                  }
                }, true);

              }
          }
      }]);
});
