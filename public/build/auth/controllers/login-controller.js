define(["auth/module"],function(a){"use strict";return a.registerController("LoginCtrl",["$scope","$cookies","$state","$window","$rootScope","AuthenticationService",function(a,b,c,d,e,f){a.email="",a.password="",a.submit=function(){var g=new Date;g.setDate(g.getDate()+365),""!=a.email&&""!=a.password&&f.login(a.email,a.password,function(h){h.error?a.message=h.message:(b.put("authToken",h.authToken,{expires:g}),f.context().then(function(a){d.sessionStorage.setItem("context",JSON.stringify(a)),e.context=a,c.go("app.dashboard")}))})}}])});