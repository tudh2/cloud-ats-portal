define(["dashboard/module","lodash"],function(a,b){"use strict";a.registerDirective("morrisStackedBarGraph",function(){return{restrict:"E",replace:!0,scope:{data:"="},template:'<div class="chart no-padding"></div>',link:function(a,b){var c=function(c,d,e){var f=Morris.Bar({element:b,axes:!0,grid:!0,data:a.data,xkey:"x",ykeys:["P","F","S"],labels:["Pass","Fail","Skip"],barColors:["#15ab9f","#ff4f51","#fbd601"],hideHover:e,barSizeRatio:c,stacked:!0});f.setData(d)};a.$watch("data",function(a){if(a)switch(a.length){case 0:c(.4,a,"always");break;case 1:c(.2,a,"auto");break;case 2:c(.4,a,"auto");break;default:c(.75,a,"auto")}},!0)}}})});