define(["layout/module","lodash"],function(a,b){"use strict";a.registerDirective("smartRouterAnimationWrap",["$rootScope","$timeout",function(a,c){return{restrict:"A",compile:function(d,e){function f(){j=!0,d.css({height:d.height()+"px",overflow:"hidden"}).addClass("active"),$(h).addClass("animated faster fadeOutDown")}function g(){j&&(d.css({height:"auto",overflow:"visible"}).removeClass("active"),$(h).addClass("animated faster fadeInUp"),j=!1,c(function(){$(h).removeClass("animated")},10))}d.removeAttr("smart-router-animation-wrap data-smart-router-animation-wrap wrap-for data-wrap-for"),d.addClass("router-animation-container"),$('<div class="router-animation-loader"><i class="fa fa-gear fa-4x fa-spin"></i></div>').appendTo(d);var h=e.wrapFor,i=e.smartRouterAnimationWrap.split(/\s/),j=!1,k=a.$on("$stateChangeStart",function(a,c,d,e,g){var h=b.any(i,function(a){return b.has(c.views,a)||b.has(e.views,a)});h&&f()}),l=a.$on("$viewContentLoaded",function(a){g()});d.on("$destroy",function(){k(),l()})}}}])});