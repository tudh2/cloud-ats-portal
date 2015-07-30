define(['dashboard/module', 'lodash','morris'], function(module, _) {

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

  module.registerController('DashboardCtrl', ['$scope', function($scope) {

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

    $scope.$watch("barchart", function () {//I change here

      
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