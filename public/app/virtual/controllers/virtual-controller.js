define(['virtual/module', 'lodash'], function(module, _) {

  'use strict';

    module.registerController('VirtualCtrl', ['$scope','VirtualService','projects',function ($scope,VirtualService,projects) {
        
        $scope.tableOptions =  {
            "data": projects.data.data,
//            "bDestroy": true,
            "iDisplayLength": 15,
            "columns": [
                {
                    "class":          'details-control',
                    "orderable":      false,
                    "data":           null,
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



        VirtualService.getListTest(function(data){
            init(data);
        });
        $scope.checkSystem = false;
        $scope.checkTest = true;
        $scope.checkOffer = true;

        var init = function(listData) {
            $scope.tableOptions =  {
            "data": listData.data,
//            "bDestroy": true,
            "iDisplayLength": 15,
            "columns": [
                {
                    "class":          'details-control',
                    "orderable":      false,
                    "data":           null,
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
    };


        $scope.systemVMs = function() {
            $scope.checkSystem = $scope.checkSystem === false ? true: false;
            $scope.checkTest = !$scope.checkSystem;
            $scope.checkOffer = !$scope.checkSystem;
            VirtualService.getListSystem(function(data) {
                 init(data);
            });

        }

        $scope.testVMs = function() {
            
            $scope.checkTest = $scope.checkTest === false ? true: false;
            $scope.checkSystem = !$scope.checkTest;
            $scope.checkOffer = !$scope.checkTest;
            VirtualService.getListTest(function(data){
                 init(data);

            });
        }

        $scope.offering = function() {
           $scope.checkOffer = $scope.checkOffer === false ? true: false;
           $scope.checkSystem = !$scope.checkOffer;
           $scope.checkTest = !$scope.checkOffer;
        }

    }]);

});