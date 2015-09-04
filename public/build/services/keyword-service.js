define(["keyword/module"],function(a){"use strict";a.registerFactory("KeywordService",["$http","$cookies",function(a,b){return{run:function(c,d,e){var f={method:"POST",url:appConfig.RestEntry+"/api/v1/project/keyword/"+c+"/run",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:d};a(f).success(function(a,b){e(a,b)}).error(function(a,b){})},list:function(c){var d={method:"GET",url:appConfig.RestEntry+"/api/v1/project/keywords",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(d).success(function(a,b){c(a,b)}).error(function(a,b){})},get:function(c,d){var e={method:"GET",url:appConfig.RestEntry+"/api/v1/project/keyword/"+c,headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(e).success(function(a,b){d(a,b)}).error(function(a,b){})},create:function(c,d){var e={method:"POST",url:appConfig.RestEntry+"/api/v1/project/keyword",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:{name:c}};a(e).success(function(a,b){d(a,b)}).error(function(a,b){})},update:function(c,d,e){var f={method:"PUT",url:appConfig.RestEntry+"/api/v1/project/keyword",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:{name:d,id:c}};a(f).success(function(a,b){e(a,b)}).error(function(a,b){e(a,b)})},"delete":function(c,d){var e={method:"DELETE",url:appConfig.RestEntry+"/api/v1/project/keyword",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:c};a(e).success(function(a,b){d(a,b)}).error(function(a,b){d(a,b)})},getKeywords:function(b){a.get("api/keywords.json").success(function(a){"function"==typeof b&&b(a)})},getReport:function(c,d,e){var f={method:"GET",url:appConfig.RestEntry+"/api/v1/project/keyword/"+c+"/report/"+d,headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(f).success(function(a,b){e(a,b)}).error(function(a,b){})},getListReport:function(c,d){var e={method:"GET",url:appConfig.RestEntry+"/api/v1/project/keyword/"+c+"/reports",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(e).success(function(a,b){d(a,b)}).error(function(a,b){})}}}])});