define(["projects/module","lodash"],function(a,b){"use strict";a.registerController("ProjectsCtrl",["$rootScope","$scope","$state","$stateParams","$templateRequest","$compile","KeywordService","PerformanceService","ReportService","EventService",function(a,c,d,e,f,g,h,i,j,k){c.searchTerms="",c.options={ready:!0,running:!0,keyword:!0,performance:!0},c.toggleReady=function(){c.options.ready=c.options.ready===!0?!1:!0},c.toggleRunning=function(){c.options.running=c.options.running===!0?!1:!0},c.toggleKeyword=function(a){var b=$(a.currentTarget);b.toggleClass("active"),c.options.keyword=c.options.keyword===!0?!1:!0},c.togglePerformance=function(a){var b=$(a.currentTarget);b.toggleClass("active"),c.options.performance=c.options.performance===!0?!1:!0},c.projectFilter=function(a){var b={ready:"READY"===a.status,running:"RUNNING"===a.status,keyword:"keyword"===a.type,performance:"performance"===a.type},d=(c.options.ready&&b.ready||c.options.running&&b.running)&&(c.options.keyword&&b.keyword||c.options.performance&&b.performance);return d},c.openProject=function(a){var b=a._id,c=a.type;switch($('[data-toggle="popover"]').each(function(){$(this).popover("hide")}),c){case"performance":d.go("app.performance",{id:b});break;case"keyword":d.go("app.keyword",{id:b});break;case"functional":d.go("app.functional",{id:b})}};var l=function(){var a=$("#project-log");a.html(""),f("app/projects/views/log-modal-content.tpl.html").then(function(b){a.html(g(b)(c)),a.modal("show")})};c.openLastLog=function(a){$('[data-toggle="popover"]').each(function(){$(this).popover("hide")}),c.project=a,l()},c.openLastReport=function(a){switch($('[data-toggle="popover"]').each(function(){$(this).popover("hide")}),a.type){case"keyword":d.go("app.keyword.report",{id:a._id,jobId:a.lastJobId});break;case"performance":d.go("app.performance.report",{id:a._id,jobId:a.lastJobId})}},c.runLastest=function(a){switch(a.type){case"keyword":n(a),d.go("app.keyword",{id:a._id});break;case"performance":m(a),d.go("app.performance",{id:a._id})}};var m=function(a){var c=[];b.forEach(a.lastScripts,function(a){c.push(a._id)}),i.run(a._id,c,function(a,b){switch(b){case 200:$.smallBox({title:"Notification",content:"You have submitted project job",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;case 204:$.smallBox({title:"Notification",content:"Your project has been already running",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;default:$.smallBox({title:"Notification",content:"Can not submmit your project job",color:"#c26565",iconSmall:"fa fa-ban bounce animated",timeout:3e3})}})},n=function(a){var c=[];b.forEach(a.lastSuites,function(a){c.push(a._id)}),h.run(a._id,c,function(a,b){switch(b){case 201:$.smallBox({title:"Notification",content:"You have submitted project job",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;case 204:$.smallBox({title:"Notification",content:"Your project has been already running",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;default:$.smallBox({title:"Notification",content:"Can not submmit your project job",color:"#c26565",iconSmall:"fa fa-ban bounce animated",timeout:3e3})}})},o=function(){i.projects(function(a){void 0===c.projects&&(c.projects=[]),c.projects.push(a),c.projects=b.flatten(c.projects,!0)})},p=function(){h.list(function(a){void 0===c.projects&&(c.projects=[]),c.projects.push(a),c.projects=b.flatten(c.projects,!0)})};switch(e.type){case"performance":o();break;case"keyword":p();break;default:o(),p()}var q=function(a){c.$apply(function(){var d=JSON.parse(a.data);b.forEach(c.projects,function(a){a._id===d.project_id&&(a.status=d.project_status,a.log=d.log,"READY"===a.status?$.smallBox({title:"Notification",content:"The job "+d._id+" has finished",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3}):"RUNNING"===a.status&&(a.watchUrl=d.watch_url))})})};k.feed(q)}])});