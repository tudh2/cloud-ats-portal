define(['virtual/module', 'lodash'], function(module, _) {

  'use strict';

    module.registerController('VirtualCtrl', ['$scope','$timeout','VirtualService','projectsSystem','projectsTest',function ($scope,$timeout,VirtualService,projectsSystem,projectsTest) {
        var urlSystem = 'api/system-virtual-machine.json';
        var urlTest = 'api/test-virtual-machine.json';
        $scope.checkSystem = false;
        $scope.checkTest = true;
        $scope.checkOffer = true;

        var init = function(dataShow,url) {
            $scope.projects = dataShow;
            $scope.tableOptions =  {
            "data": dataShow.data.data,
//            "bDestroy": true,
            "iDisplayLength": 15,
            "columns": [
                {
                    "class":          'details-control',
                    "orderable":      false,
                    "data": null,
                    "defaultContent": ''
                },
                { "data": "name" },
                { "data": "public-ip" },
                { "data": "offering" },
                { "data": "status" },
                { "data": "action" }
            ],
            "order": [[1, 'asc']]
            }
        }

        init(projectsSystem);
        /*VirtualService.getList(urlSystem,function(listData) {
            $scope.someData = listData;
            init($scope.someData,urlSystem);
        });*/

        $scope.systemVMs = function() {
            $scope.check = $scope.check === false ? true: false;
            if($scope.checkSystem) {
                $scope.checkSystem = $scope.checkSystem === false ? true: false;
                $scope.checkTest = !$scope.checkSystem;
                $scope.checkOffer = !$scope.checkSystem;
            }
            init(projectsSystem);
            
        }

        $scope.testVMs = function() {
            $scope.check = $scope.check === false ? true: false;
            if($scope.checkTest) {
                $scope.checkTest = $scope.checkTest === false ? true: false;
                $scope.checkSystem = !$scope.checkTest;
                $scope.checkOffer = !$scope.checkTest;
            }
            init(projectsTest);

        }

        $scope.offering = function() {
            if($scope.checkOffer) {
               $scope.checkOffer = $scope.checkOffer === false ? true: false;
               $scope.checkSystem = !$scope.checkOffer;
               $scope.checkTest = !$scope.checkOffer;
            }
           
        }

    }]);

});