define(['dashboard/module', 'lodash','morris'], function(module, _) {

  'use strict';

  
  module.registerDirective('morrisStackedBarGraph', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
              data: '='
            },
            template: '<div class="chart no-padding"></div>',
            link: function(scope, element){
              var hoverStatus = 'always';
              
              if(scope.data.length)
                hoverStatus = true;
              
              var graph = Morris.Bar({
                              element : element,
                              axes : true,
                              grid : true,
                              data : scope.data,
                              xkey : 'x',
                              ykeys : ['P', 'F', 'S'],
                              labels : ['Pass', 'Fail', 'Skip'],
                              barColors : ['#15ab9f','#ff4f51','#fbd601'],
                              hideHover: hoverStatus,
                              stacked : true
                          });

              scope.$watch('data', function(value) {
                if(value) {
                  graph.setData(value);
                }
              }, true);
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

  module.registerController('DashboardCtrl', ['$scope','KeywordService', function($scope,KeywordService) {

    $scope.project_overview = true;

    $scope.versionSelected = '1';

    $scope.chooseTestCase = true;

    $scope.organize = false;

    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.recent_finished_projects = [];
    $scope.top_passed_projects = [];
    $scope.top_failed_projects = [];
    $scope.biggest_projects = [];

  var totalProject = function(percent,type) {
    var top = [];
    var project = {
        name : data[i].x,
        percent : percent
      }

    top.push(project);
    var array = _.map(_.sortByOrder(top, ['percent'], ['desc']), _.values);
    
    _.forEach(array, function(item,key){
        project = {
          name : item[0],
          percent : item[1]
        }
        if(_.isEqual('pass', type)) {
          $scope.top_passed_projects.push(project);
          if($scope.top_passed_projects.length > 5) {
            var temp = $scope.top_passed_projects;
            var size = temp.length - 5;
            $scope.top_passed_projects.splice(5,size);
          }
        } else if(_.isEqual('fail', type)) {
          $scope.top_failed_projects.push(project);
          if($scope.top_failed_projects.length > 5) {
            var temp = $scope.top_failed_projects;
            var size = temp.length - 5;
            $scope.top_failed_projects.splice(5,size);
          }
        }
        
    });

  }

  var getInfoProjects = function(data) {
    //get list top fail projects
    var topPass = [];
    for(var i = 0; i < data.length; i ++) {
      var item = data[i];
      var totalCases = item.P+item.S+item.F;
      var percent = _.round((item.P/totalCases)*100,2);
      var project = {
        name : data[i].x,
        percent : percent
      }

      topPass.push(project);
    }
    var arrayPass = _.map(_.sortByOrder(topPass, ['percent'], ['desc']), _.values);
    
    _.forEach(arrayPass, function(item,key){
        project = {
          name : item[0],
          percent : item[1]
        }
        $scope.top_passed_projects.push(project);
    });

    if($scope.top_passed_projects.length > 5) {
      var temp = $scope.top_passed_projects;
      var size = temp.length - 5;
      $scope.top_passed_projects.splice(5,size);
    }
    
  }

  var loadDataReport = function(data,projectName,numberOfJobId) {
      var totalPass = 0;
      var totalFail = 0;
      var totalSkip = 0;
      var totalCases = 0;
      var dataObject = JSON.parse(data.suite_reports);
      for(var i = 0; i < dataObject.length; i++) {
        var item = dataObject[i];
        totalPass += item.total_pass;
        totalFail += item.total_fail;
        totalSkip += item.total_skip;
      }
      var projectReport = {
        x : projectName,
        P : totalPass,
        F : totalFail,
        S : totalSkip
      };
      $scope.recent_finished_projects.push(projectReport);

      if($scope.recent_finished_projects.length == numberOfJobId) {
        getInfoProjects($scope.recent_finished_projects);

        if($scope.recent_finished_projects.length > 10) {
          var temp = $scope.recent_finished_projects;
          var size = temp.length - 10;
          $scope.recent_finished_projects.splice(10,size);
        }
      }
      
  }

  var loadData = function() {
      var listProjects = [];
      var projectInfo = {};

      KeywordService.list(function(data,status) {
        listProjects = data;
        var countJobId = 0;
        _.forEach(listProjects, function(item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId === undefined) {
            countJobId ++;
          }
        })

        _.forEach(listProjects, function(item,key) {
          var lastJobId = item.lastJobId;
          var numberOfJobId = listProjects.length - countJobId;
          if(lastJobId) {
            var projectId = item._id;
            var projectName = item.name;

            KeywordService.getReport(projectId,lastJobId,function(dataReport,statusReport) {
              loadDataReport(dataReport,projectName,numberOfJobId);
            });
          }
        })

      });
      
    }

    loadData();
    $scope.$watch('barchart', function () {//I change here
    });

    $scope.selectChome = function () {
      $scope.versionSelected = 1;
    }
    $scope.selectFirefox = function () {
      $scope.versionSelected = 2;
    }
    $scope.selectIE = function () {
      $scope.versionSelected = 3;
    }
    $scope.selectSafari = function () {
      $scope.versionSelected = 4;
    }
    $scope.selectOpera = function () {
      $scope.versionSelected = 5;
    }
    $scope.new_project = function () {
      $scope.project_overview = false;
      $('[data-toggle="popover"]').each(function () {
        $(this).popover('hide');
      });
    }
    
    $scope.chooseTestSuite = function (suiteNumber, $event) {
      $scope.testSuiteSelected = suiteNumber;

      var $div = $event.currentTarget;
      var $parent = $($div).parent().find(".test-suite");
      _.forEach($parent, function (element) {
        $(element).css('background-color', 'white');

        $(element).css('border-left', '3px solid white');
      });
      $($div).css('background-color', '#EBF3F5');
      $($div).css('border-left', '3px solid #ff4f51');
    }
    // get files after files were uploaded
    $scope.uploadFile = function (element) {
      $scope.file = element.files;

      delete $scope.file.length;
      
      var fileNames = '';
      _.forEach($scope.file, function (file) {
        fileNames += file.name + ',';
        
      });
      $('input[name="listFile"]').val(fileNames);

    }

    $scope.chooseOrder = function (a) {
      console.log(a);

    }
    $scope.clickSaveTestCasesChoosed = function () {
      $scope.chooseTestCase = false;
    }

    $scope.clickOrganizeTestSuite = function () {
      $scope.organize = true;
      $scope.chooseTestCase = true;
    }
    $scope.newSampler = function () {
      changeModalSize();
    }

    $scope.basic = function () {
      resetModalSize();
    }

    $scope.configuration = function () {
      resetModalSize();
    }

    $scope.clickUploadScriptButton = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '20px');
    }

    $scope.clickCreateScriptButton = function () {
      var $id = $('#createScript').find('.nav.nav-tabs .active a').attr('id');
      if ($id === 'samplersId') {
        changeModalSize();
      } else if ($id === 'basicId' || $id === 'configurationId') {
        resetModalSize();
      }

    }

    $scope.addBorder = function ($event) {

      var $this = $event.currentTarget;
      
      var $div = $($this).find('.number').parent();
      var $next = $($div).find('.remove-icon');
      if ($($this).hasClass("t-border")){
        $($this).removeClass("t-border");
      } else {
        $($this).addClass("t-border");
      }
    }

    var resetModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "");
    }

    var changeModalSize = function () {
      $('#createScript .modal-dialog .modal-content').css("width", '980px');
      $('#createScript .modal-dialog .modal-content').css("margin-left", '-120px');
      $('#createScript .modal-dialog .modal-content .modal-body').css("padding", "0px");
    }
  }
  ]);
});