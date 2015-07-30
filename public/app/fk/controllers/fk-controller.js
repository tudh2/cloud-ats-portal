define(['fk/module', 'lodash', 'morris', 'notification'], function(module, _) {
  
  'use strict';
  
  var bar_data= [{
      x : 'Project 1',
      P : 100,
      F : 10,
      S : 10
  }, {
      x : 'Project 2',
      P : 100,
      F : 0,
      S : 0
  }, {
      x : 'Project 3',
      P : 90,
      F : 10,
      S : 0
  }, {
      x : 'Project 4',
      P : 90,
      F : 0,
      S : 10
  }]
  module.registerDirective('morrisStackedBarGraph', function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="chart no-padding"></div>',
            link: function(scope, element){
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
    })  
  var day_data = [{
        "elapsed" : "I",
        "value" : 34
    }, {
        "elapsed" : "II",
        "value" : 24
    }, {
        "elapsed" : "III",
        "value" : 3
    }, {
        "elapsed" : "IV",
        "value" : 12
    }, {
        "elapsed" : "V",
        "value" : 13
    }, {
        "elapsed" : "VI",
        "value" : 22
    }, {
        "elapsed" : "VII",
        "value" : 5
    }, {
        "elapsed" : "VIII",
        "value" : 26
    }, {
        "elapsed" : "IX",
        "value" : 12
    }, {
        "elapsed" : "X",
        "value" : 19
    }, {
        "elapsed" : "II",
        "value" : 24
    }, {
        "elapsed" : "III",
        "value" : 3
    }, {
        "elapsed" : "IV",
        "value" : 12
    }, {
        "elapsed" : "V",
        "value" : 13
    }, {
        "elapsed" : "VI",
        "value" : 22
    }, {
        "elapsed" : "VII",
        "value" : 5
    }, {
        "elapsed" : "VIII",
        "value" : 26
    }, {
        "elapsed" : "IX",
        "value" : 12
    }, {
        "elapsed" : "X",
        "value" : 19
    }, {
        "elapsed" : "II",
        "value" : 24
    }, {
        "elapsed" : "III",
        "value" : 3
    }, {
        "elapsed" : "IV",
        "value" : 12
    }, {
        "elapsed" : "V",
        "value" : 13
    }, {
        "elapsed" : "VI",
        "value" : 22
    }, {
        "elapsed" : "VII",
        "value" : 5
    }, {
        "elapsed" : "VIII",
        "value" : 26
    }, {
        "elapsed" : "IX",
        "value" : 12
    }, {
        "elapsed" : "X",
        "value" : 19
    }];

  module.registerDirective('morrisStackedLineHitGraph', function(){
  return {
	  restrict: 'E',
	  replace: true,
	  template: '<div class="chart no-padding"></div>',
	  link: function(scope, element){
		  Morris.Line({
			  element : element,
			  data : day_data,
			  xkey : 'elapsed',
			  ykeys : ['value'],
			  labels : ['value'],
			  lineColors : ['#15ab9f'],
			  parseTime : false
		  });

	  }
  }
})
  module.registerDirective('morrisStackedLineTransactionGraph', function(){
  return {
	  restrict: 'E',
	  replace: true,
	  template: '<div class="chart no-padding"></div>',
	  link: function(scope, element){
		  Morris.Line({
			  element : element,
			  data : day_data,
			  xkey : 'elapsed',
			  ykeys : ['value'],
			  labels : ['value'],
			  lineColors : ['#ff4f51'],
			  parseTime : false
		  });

	  }
  }
})
  module.registerController('FKCtrl', ['$rootScope', '$scope', 'UserService', 'DataService', 'KeywordService','$state',
    function($rootScope, $scope, userService, dataService, keywordService, $state) {

    $scope.project_overview = true;

    $scope.versionSelected = '1';

    $scope.organize = false;
    $scope.oldOrder = null;
    
    $scope.testCasesSelected = [];
    $scope.testSuiteSelected = {};

    $scope.testcases = $scope.cases;

    $scope.project = {
      'projectType': undefined,
      'suites': []
    };

    $scope.cases = [
    {
      "name": "Test Case 1",
      "steps": [],
      "info":""
      }
    ];

    $scope.showAllCases = true;
    $scope.disable = false;
    $scope.lists = [];
    $scope.performance = false;
    $scope.customKeyword = false;

    $scope.openProject = function (project) {
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });
      $scope.project_overview = false;
      $scope.project = project;
      $scope.performance = false;
    }

    $scope.clickNewTestSuiteButton = function ($event) {

      $scope.showAllCases = true;
      toggleSaveAndCancelButton(1);
      toggleEditAndOrganizeButton(0);
      $scope.disable = true;
      var element = $event.currentTarget;
      $scope.testSuiteSelected = {};
      $scope.testCasesSelected = [];
      var $input_suite_name = $(element).next();
      $input_suite_name.show();
      
      var groupTestcases = $('.group-test-case');

      _.forEach(groupTestcases, function(e){
        $(e).css('border', '2px solid #DBDBDB');
        $(e).css('pointer-events', 'initial');
      });
    };
    $scope.closeDetailPage = function () {
      $scope.project_overview = true;
    };

    $scope.customKey = function (status) {
        if(!status) {
            $scope.customKeyword = true;
        } else {
             $scope.customKeyword = false;
        }
        console.log($scope.customKeyword);
    };
	
    keywordService.getListFunctionalProject(function (response) {
      $scope.functionalPros = response;

      _.forEach($scope.functionalPros, function (project) {
        _.forEach(project.suites, function (suite) {
          suite.cases = JSON.parse(suite.cases);
        });
      });

    });
    var getData = function() {
        keywordService.getListTestCase(function(data) {
            $scope.lists = data;
        });
    };
    getData();
    $scope.removeSuite = function (suite) {
      keywordService.removeTestSuite(suite._id, $scope.project.projectId, function(data){
        if (data != null) {
          $scope.project.totalCases = data.totalTestCases;
          $.smallBox({
            title: "The suite has removed",
            content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
            color: "#5F895F",
            iconSmall: "fa fa-check bounce animated",
            timeout: 4000
          });
          _.remove($scope.project.suites, function(data){
            return suite == data;
          });
          $scope.testSuiteSelected = {};
          $scope.showAllCases = true;
          toggleEditAndOrganizeButton(0);
          toggleSaveAndCancelButton(0);
        }
      });

    };

    $scope.clickSaveProject = function () {
      $scope.project_overview = false;
      
      $('#createProject').modal('hide');
	  $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      var object = {'projectName': $scope.project.projectName};

      if ($scope.performance == false) {
        keywordService.createKeywordProject(object, function (data) {
          $scope.project.projectId = data;
          $scope.functionalPros.push($scope.project);
        });
      } else {

      }
    };

    $scope.chooseFunctionalType = function ($event) {

      var element = $event.currentTarget;
      $scope.project.projectType = $(element).val();
      $scope.performance = false;
    };

    $scope.choosePerformanceType = function ($event) {

      var element = $event.currentTarget;
      $scope.project.projectType = $(element).val();
      $scope.performance = true;
    };

    $scope.runTestFunctional = function () {

      var projectId = $scope.project.projectId;
      var suiteIds = [];
      var project = {};

      var $checkList = $('.suiteId').find('.checked');
      _.forEach($checkList, function (item) {
        var idObject = {};
        idObject._id = $(item).val();
        suiteIds.push(idObject);
      });

      project.projectId = projectId;
      project.suiteIds = suiteIds;
      keywordService.runKeywordProject(project, function(data, status){
        if (data != null) {
           $.smallBox({
            title: "Keyword Project",
            content: "<i class='fa fa-clock-o'></i> <i>Keyword project has created.</i>",
            color: "#659265",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });

          $scope.project_overview = true;
        }
      });
    };

    $scope.new_project = function () {
      $scope.project = {
        'projectType': undefined,
        'suites': []
      };
    };

    $scope.chooseTestSuite = function (suite, $event) {
      $scope.showAllCases = false;
      $scope.disable = true;
      $scope.organize = false;
      toggleEditAndOrganizeButton(1);
      toggleSaveAndCancelButton(0);
      $scope.testSuiteSelected = suite;
      var div = $event.currentTarget;
      var $parent = $(div).parent().find(".test-suite");
      _.forEach($parent, function (element) {
        $(element).css('background-color', 'white');
      });
      $(div).css('background-color', '#EBF3F5');
    };
    // get files after files were uploaded
    $scope.uploadFile = function (element) {
      $scope.file = element.files;

      delete $scope.file.length;
      
      var fileNames = '';
      _.forEach($scope.file, function (file) {
        fileNames += file.name + ',';
        
      });
      $('input[name="listFile"]').val(fileNames);

    };

    $scope.clickSaveTestSuiteChoosed = function () {

      toggleSaveAndCancelButton(0);
      
      if ($scope.testSuiteSelected._id != null) {
        console.log('update');
        var testsuite = {
          'projectId': $scope.project.projectId,
          'suiteId': $scope.testSuiteSelected._id,
          'cases': $scope.testSuiteSelected.cases
        }
        var data = {'data': testsuite};
        console.log($scope.testSuiteSelected.cases);
        $scope.showAllCases = false;
        //$scope.testSuiteSelected.cases = $scope.testCasesSelected;
        keywordService.updateTestSuite(data, function (response) {
          $scope.project.totalCases = response.totalTestCases;
          if (response != null) {
            $.smallBox({
              title: "Test Suite",
              content: "<i class='fa fa-clock-o'></i> <i>Your test suite has updated.</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            toggleEditAndOrganizeButton(1);
          }
        }); 
      } else {
        console.log('create');
        var input_suite_name = $('.list_testSuite .create-new-suite .input-suite-name .input-text-name');
        var testsuite = {
          '_id': $scope.project.projectId,
          'suite_name': input_suite_name.val(),
          'cases': $scope.testCasesSelected
        };

        var data = {'data': testsuite};
        keywordService.createTestSuite(data, function(response) {
          testsuite._id = response.suiteId;
          $scope.project.totalCases = response.totalTestCases;
          if (response != null) {
            $.smallBox({
              title: "Test Suite",
              content: "<i class='fa fa-clock-o'></i> <i>Your test suite has created.</i>",
              color: "#659265",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            input_suite_name.val('');
            $scope.project.suites.push(testsuite);
            input_suite_name.parent().hide();
            var groupTestcases = $('.group-test-case-enable');
            _.forEach(groupTestcases, function(e){
              console.log('1');
              $(e).css('border', '2px solid #DBDBDB');
              $(e).css('pointer-events', 'none');
            });

          }
        });

      }
    };

    $scope.editTestSuite = function (suite) {
      var testcases = suite;
      $scope.showAllCases = true;
      $scope.disable = true;
      $scope.organize = false;
      $scope.testCasesSelected = suite.cases;
      $scope.testcases = $scope.cases;
      toggleSaveAndCancelButton(1);
      toggleEditAndOrganizeButton(0);
      
    };

    $scope.cancelActions = function () {
      $scope.showAllCases = true;
      $scope.disable = false;
      $scope.organize = false;
      toggleSaveAndCancelButton(0);
      toggleEditAndOrganizeButton(0);
      $scope.testSuiteSelected = {};
      var input_suite_name = $('.list_testSuite .create-new-suite .input-suite-name .input-text-name');
      input_suite_name.parent().hide();
    };

    $scope.checkExist = function (caze1, cases) {
      var count = 0;
      _.forEach(cases, function (caze) {
        if (caze._id == caze1._id) {
          count ++;
        }
      });
      if (count > 0) {
        return true;
      } else return false;
    };

    $scope.clickOrganizeTestSuite = function () {
      $scope.organize = true;
      
      toggleSaveAndCancelButton(1);
      toggleEditAndOrganizeButton(0);
    };
   
    $scope.chooseOrder = function (a) {

      $scope.testSuiteSelected.cases = insertValueByIndex($scope.testSuiteSelected.cases, $scope.oldOrder, a);
      console.log($scope.testSuiteSelected.cases);
     // $scope.testCasesSelected = $scope.testSuiteSelected.cases;
    };

    $scope.focusCallback = function ($event) {
      var targetField = $event.target;
      var element = targetField;
      var oldOrder = $(element).find(':selected').text();

      $scope.oldOrder = oldOrder;

      $scope.clickElement = $(element);
    };

   
    $scope.addCaseToSuite = function ($event, testcase) {

      var element = $event.currentTarget;
      
      var $div = $(element).find('.number').parent();
      var $next = $div.find('.remove-icon');
      
      //$scope.testCasesSelected = $scope.testSuiteSelected.cases;
      if ($(element).css('border') == ("2px solid rgb(219, 219, 219)")){
        $scope.testCasesSelected.push(testcase);
        $(element).css("border", "2px solid #02B39F");
      } else {
         _.remove($scope.testCasesSelected, function (test) {
          return testcase._id == test._id;
        });
        $(element).css("border", "2px solid #DBDBDB");
        $(element).css("padding", "");
      }

    };
    $scope.findFunctionalProject = function(event) {
      var element = event.currentTarget;

      var icon = $(element).find('.functional');
      if (icon.css('color') == 'white') {

      } else 
          icon.css('color','white');
    };


    $scope.check = function ($event) {
      var element = $event.currentTarget;

      $(element).toggleClass('checked');
    };

    $scope.selectChome = function () {
      $scope.versionSelected = 1;
    };
    $scope.selectFirefox = function () {
      $scope.versionSelected = 2;
    };
    $scope.selectIE = function () {
      $scope.versionSelected = 3;
    };
    $scope.selectSafari = function () {
      $scope.versionSelected = 4;
    };
    $scope.selectOpera = function () {
      $scope.versionSelected = 5;
    };

    $scope.clickUploadScriptButton = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '20px');
    };

    $scope.clickCreateScriptButton = function () {
      var $id = $('#createScript').find('.nav.nav-tabs .active a').attr('id');
      if ($id === 'samplersId') {
        console.log('sampler');
        changeModalSize();
      } else if ($id === 'basicId' || $id === 'configurationId') {
        console.log('not sampler');
        resetModalSize();
      }

    };

    $scope.newSampler = function () {
      changeModalSize();
    };

    $scope.basic = function () {
      resetModalSize();
    };

    $scope.configuration = function () {
      resetModalSize();
    };

    $scope.fkWizardCompleteCallback = function(wizardData) {
        var projectName = wizardData.project_name;
        console.log('wizardCompleteCallback', wizardData);
        keywordService.createKeywordProject($scope.cases,$scope.suites,wizardData,function (data,status) {
            $state.go('app.keywordlist');
        });
      $.smallBox({
        title: "Functional Keywords Framework",
        content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 4000
      });
    };

    /*test case*/

    $scope.infoBasic = "";
    $scope.newName = "";
    $scope.nameCustomKeyword = "input text";

    $scope.customKeyword = false;
    $scope.editCustomKeyword =false;
    $scope.customKey = function (status) {
        if(!status) {
            $scope.customKeyword = true;
        } else {
             $scope.customKeyword = false;
        }
    };

    $scope.setInfo = function(infoBasic) {
        $scope.cases[0].name = $scope.newName;
        $scope.cases[0].info = infoBasic;
        /*keywordService.newTestCase($scope.cases,function(data,status) {
            $rootScope.$watch('data', function(){
                getData();
            });
        });*/
        $.smallBox({
        title: "Success",
        content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 2000
      });
    };

    /*----------*/

    var resetModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "");
    };

    var changeModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '980px');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '-120px');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "0px");
    };

    var toggleSaveAndCancelButton = function (a) {
      var $save = $('.action-testcase').find('.col-sm-12 .col-sm-8 .row .col-sm-3 .savetestcase');
      var $cancel = $('.action-testcase').find('.col-sm-12 .col-sm-8 .row .col-sm-3 .cancelbutton');
      switch (a) {
        case 0:
          $save.css('display', 'none');
          $cancel.css('display', 'none');
          break;
        case 1: 
          $save.css('display', 'block');
          $cancel.css('display', 'block');
      }
    };
    
    var toggleEditAndOrganizeButton = function (a) {
      var $save = $('.action-testcase').find('.col-sm-12 .col-sm-8 .row .col-sm-3 .edittestsuite');
      var $cancel = $('.action-testcase').find('.col-sm-12 .col-sm-8 .row .col-sm-3 .organizetestsuite');
      
      switch (a) {
        case 0: 
          $save.css('display', 'none');
          $cancel.css('display', 'none');
          break;
        case 1: 
          $save.css('display', 'block');
          $cancel.css('display', 'block');
      }
    };

    var insertValueByIndex = function (originArray, oldIndex, newIndex) {
      var value = originArray[oldIndex];
      originArray.splice(oldIndex, 1);

      var newArray1 = originArray.slice(0,newIndex);
      var newArray2 = originArray.slice(newIndex);

      if (oldIndex == newIndex) {
        return;
      } else newArray1.push(value);
      return newArray1.concat(newArray2);
    };

    /*Nambv2*/

$scope.infoBasic = "";
    $scope.editCaseName = "";
    $scope.nameCustomKeyword = "";

    $scope.addCase = false;
    $scope.addCustom = false;
    $scope.updateCustom = false;
    $scope.updateCase = false;

    $scope.customKeyword = false;
    $scope.editCustomKeyword =false;
    $scope.showQuickCreateCustom = false;

    $scope.newTestCaseStatus = function() {
      $scope.addCase = true;
      $scope.addCustom = false;
      $scope.updateCustom = false;
      $scope.updateCase = false;
      $scope.caseName = "";
      $scope.infoBasic = "";
      $scope.showQuickCreateCustom = true;
    }

    $scope.customKeywordStatus = function() {
      $scope.addCase = false;
      $scope.addCustom = true;
      $scope.updateCustom = false;
      $scope.updateCase = false;
    }

    $scope.editCustomKeyStatus = function() {
      $scope.addCase = false;
      $scope.addCustom = false;
      $scope.updateCustom = true;
      $scope.updateCase = false;
    }

    $scope.editCaseStatus = function(index) {
      $scope.addCase = false;
      $scope.addCustom = false;
      $scope.updateCustom = false;
      $scope.updateCase = true;
      $scope.indexCaseEdit = index;
      $scope.showQuickCreateCustom = false;
    }

    $scope.createNewTestCase = function() {
        keywordService.newTestCase($scope.cases,function(data,status) {
            $rootScope.$watch('data', function(){
                getData();
            });
        });
    }

    $scope.customKey = function (status) {
        if(!status) {
            $scope.customKeyword = true;
        } else {
             $scope.customKeyword = false;
        }
    }

    $scope.editCustom = function(status,custom) {
        console.log(custom);
        $scope.cases[0]._id = custom._id;
        $scope.cases[0].name = custom.name;
        $scope.cases[0].steps = custom.actions;
        if(!status) {
            $scope.editCustomKeyword = true;
        } else {
             $scope.editCustomKeyword = false;
        }
    }

    $scope.updateCustomKeyword = function() {
        var projectId = $scope.project.projectId;
        keywordService.updateCustomKeyword($scope.cases,projectId,function(data,status) {
            $rootScope.$watch('data', function() {
                $rootScope.$watch('context', function(value){
                        var tenant = $rootScope.context.tenant._id;
                        var space = $rootScope.context.space;
                        if (space === undefined) {
                            space = {_id: null};
                        }
                        getCustomKeywords(tenant,space._id,$scope.project.projectId);
                });
            });
        });
    }

    $scope.updateTestCase = function() {
      console.log($scope.cases);
      keywordService.updateCase($scope.cases,function(data,status) {
        $rootScope.$watch('data', function() {
          getData();
        });
      });
    }

    $scope.removeCase = function() {
      var caseId = $scope.cases[0]._id;
      keywordService.removeCase(caseId,function(data,status) {
        $scope.lists.splice($scope.indexCaseEdit, 1);
        $.smallBox({
          title: "Delete Test Case Success",
          content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
          color: "#5F895F",
          iconSmall: "fa fa-check bounce animated",
          timeout: 1000
        });
      });
    }

    $scope.editNameCase = function(newName) {
      $scope.cases[0].name = newName;
    }

    $scope.addCustomKeyword = function() {
        console.log("here");
        var projectId = $scope.project.projectId;
        keywordService.addCustomKeyword($scope.cases,projectId,function(data,status) {
            $rootScope.$watch('data', function() {
                $rootScope.$watch('context', function(value){
                        var tenant = $rootScope.context.tenant._id;
                        var space = $rootScope.context.space;
                        if (space === undefined) {
                            space = {_id: null};
                        }
                        getCustomKeywords(tenant,space._id,$scope.project.projectId);
                        //$scope.listCustomKeywords.push($scope.cases[0]);
                });
            });
        });
    }

    var getCustomKeywords = function(tenant,space,projectID) {
        keywordService.getCustomKeywords(tenant,space,projectID,function(data,status) {
            $scope.listCustomKeywords = data;
        });
    }

    $scope.getListCustomKeywords = function() {
        $rootScope.$watch('context', function(value){
            var tenant = $rootScope.context.tenant._id;
            var space = $rootScope.context.space;
            if (space === undefined) {
                space = {_id: null};
            }
            getCustomKeywords(tenant,space._id,$scope.project.projectId);
        });
    }
    var removeCustomKey = function(projectID,customKeywordName,index) {
        keywordService.removeCustomKeyword(projectID,customKeywordName,function(data,status) {
            $scope.listCustomKeywords.splice(index, 1); 
        });
    }
    $scope.removeCustomKeyword = function(customKeywordName,index) {
        removeCustomKey($scope.project.projectId,customKeywordName,index);
    }

    $scope.newCaseName = function(value, attributes) {
        if(_.isEqual("", value) == false) {
            $scope.cases[0].name = value;   
        }
    }

    $scope.setInfo = function(info) {
        $scope.cases[0].info = info;
        $scope.infoBasic = info;
        console.log(info);
        $.smallBox({
          title: "Set Name Test Case Success",
          content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
          color: "#5F895F",
          iconSmall: "fa fa-check bounce animated",
          timeout: 1000
        });
    }

    $scope.resetCase = function(name) {
      $scope.cases = [
      {
          "name": name,
          "steps": [],
          "info":""
        }
      ];
    }

    /*end nambv2*/
	$scope.redirectTo = function() {
		 $state.go('app.report');
	 };
  }]);
})