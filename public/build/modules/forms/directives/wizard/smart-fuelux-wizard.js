define(["layout/module","lodash","fuelux-wizard"],function(a,b){"use strict";return a.registerDirective("smartFueluxWizard",function(){return{restrict:"A",scope:{smartWizardCallback:"&"},link:function(a,c,d){var e=c.wizard(),f=c.find("form");e.on("actionclicked.fu.wizard",function(a,b){f.data("validator")&&(f.valid()||(f.data("validator").focusInvalid(),a.preventDefault()))}),e.on("finished.fu.wizard",function(c,d){var e={};b.each(f.serializeArray(),function(a){e[a.name]=a.value}),"function"==typeof a.smartWizardCallback()&&a.smartWizardCallback()(e)})}}})});