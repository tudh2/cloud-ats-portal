define(["performance/module","notification"],function(a){"use strict";a.registerController("UploadScriptCtrl",["$scope","$stateParams","ScriptService",function(a,b,c){a.file=void 0,a.uploadFile=function(b){a.file=b.files,delete a.file.length;var c="";_.forEach(a.file,function(a){c+=a.name+","}),$('input[name="listFile"]').val(c),""!=$('input[name="listFile"]').val(c)&&$('input[name="listFile"]').parent().removeClass("has-error")};var d=$(".upload_name"),e=$('input[name="listFile"]');d.on("keypress",function(){""!=$(this).val().trim()&&$(this).parent().removeClass("has-error")}),a.saveUploadedScripts=function(){""==d.val().trim()||""==e.val()?""==d.val().trim()&&""==e.val()?(d.parent().addClass("has-error"),e.parent().addClass("has-error")):""==e.val()?(e.addClass("has-error"),e.focus()):(d.parent().addClass("has-error"),d.focus()):($("#uploadScript").modal("hide"),$("body").removeClass("modal-open"),$(".modal-backdrop").remove(),c.createScriptTestByUpload(a.file,d.val(),b.id,function(b,c){null!=b&&($.smallBox({title:"The script has created",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3}),_.forEach(b,function(c){a.scripts.push(c),a.totalScripts+=b.length}))}))}}])});