define(["dashboard/module","lodash","morris"],function(a,b){"use strict";var c=[{x:"Project 1",P:100,F:10,S:10},{x:"Project 2",P:100,F:0,S:0},{x:"Project 3",P:90,F:10,S:0},{x:"Project 4",P:90,F:0,S:10}];a.registerDirective("morrisStackedBarGraph",function(){return{restrict:"E",replace:!0,template:'<div class="chart no-padding"></div>',link:function(a,b){Morris.Bar({element:b,axes:!0,grid:!0,data:c,xkey:"x",ykeys:["P","F","S"],labels:["Pass","Fail","Skip"],barColors:["#15ab9f","#ff4f51","#fbd601"],stacked:!0})}}});var d=[{elapsed:"I",value:34},{elapsed:"II",value:24},{elapsed:"III",value:3},{elapsed:"IV",value:12},{elapsed:"V",value:13},{elapsed:"VI",value:22},{elapsed:"VII",value:5},{elapsed:"VIII",value:26},{elapsed:"IX",value:12},{elapsed:"X",value:19},{elapsed:"II",value:24},{elapsed:"III",value:3},{elapsed:"IV",value:12},{elapsed:"V",value:13},{elapsed:"VI",value:22},{elapsed:"VII",value:5},{elapsed:"VIII",value:26},{elapsed:"IX",value:12},{elapsed:"X",value:19},{elapsed:"II",value:24},{elapsed:"III",value:3},{elapsed:"IV",value:12},{elapsed:"V",value:13},{elapsed:"VI",value:22},{elapsed:"VII",value:5},{elapsed:"VIII",value:26},{elapsed:"IX",value:12},{elapsed:"X",value:19}];a.registerDirective("morrisStackedLineHitGraph",function(){return{restrict:"E",replace:!0,template:'<div class="chart no-padding"></div>',link:function(a,b){Morris.Line({element:b,data:d,xkey:"elapsed",ykeys:["value"],labels:["value"],lineColors:["#15ab9f"],parseTime:!1})}}}),a.registerDirective("morrisStackedLineTransactionGraph",function(){return{restrict:"E",replace:!0,template:'<div class="chart no-padding"></div>',link:function(a,b){Morris.Line({element:b,data:d,xkey:"elapsed",ykeys:["value"],labels:["value"],lineColors:["#ff4f51"],parseTime:!1})}}}),a.registerController("DashboardCtrl",["$scope",function(a){a.project_overview=!0,a.versionSelected="1",a.chooseTestCase=!0,a.organize=!1,a.labels=["2006","2007","2008","2009","2010","2011","2012"],a.series=["Series A","Series B"],a.data=[[65,59,80,81,56,55,40],[28,48,40,19,86,27,90]],a.$watch("barchart",function(){}),a.selectChome=function(){a.versionSelected=1},a.selectFirefox=function(){a.versionSelected=2},a.selectIE=function(){a.versionSelected=3},a.selectSafari=function(){a.versionSelected=4},a.selectOpera=function(){a.versionSelected=5},a.new_project=function(){a.project_overview=!1,$('[data-toggle="popover"]').each(function(){$(this).popover("hide")})},a.chooseTestSuite=function(c,d){a.testSuiteSelected=c;var e=d.currentTarget,f=$(e).parent().find(".test-suite");b.forEach(f,function(a){$(a).css("background-color","white"),$(a).css("border-left","3px solid white")}),$(e).css("background-color","#EBF3F5"),$(e).css("border-left","3px solid #ff4f51")},a.uploadFile=function(c){a.file=c.files,delete a.file.length;var d="";b.forEach(a.file,function(a){d+=a.name+","}),$('input[name="listFile"]').val(d)},a.chooseOrder=function(a){console.log(a)},a.clickSaveTestCasesChoosed=function(){a.chooseTestCase=!1},a.clickOrganizeTestSuite=function(){a.organize=!0,a.chooseTestCase=!0},a.newSampler=function(){d()},a.basic=function(){c()},a.configuration=function(){c()},a.clickUploadScriptButton=function(){$("#createScript .modal-dialog .modal-content").css("width",""),$("#createScript .modal-dialog .modal-content").css("margin-left","20px")},a.clickCreateScriptButton=function(){var a=$("#createScript").find(".nav.nav-tabs .active a").attr("id");"samplersId"===a?d():("basicId"===a||"configurationId"===a)&&c()},a.addBorder=function(a){var b=a.currentTarget,c=$(b).find(".number").parent();$(c).find(".remove-icon");$(b).hasClass("t-border")?$(b).removeClass("t-border"):$(b).addClass("t-border")};var c=function(){$("#createScript .modal-dialog .modal-content").css("width",""),$("#createScript .modal-dialog .modal-content").css("margin-left",""),$("#createScript .modal-dialog .modal-content .modal-body").css("padding","")},d=function(){$("#createScript .modal-dialog .modal-content").css("width","980px"),$("#createScript .modal-dialog .modal-content").css("margin-left","-120px"),$("#createScript .modal-dialog .modal-content .modal-body").css("padding","0px")}}])});