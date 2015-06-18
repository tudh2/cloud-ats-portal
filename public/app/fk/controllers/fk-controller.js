define(['fk/module'], function(module) {
  
  'use strict';

  module.registerController('FKCtrl', ['$rootScope', '$scope', 'UserService', 'DataService',
    function($rootScope, $scope, userService, dataService) {

    $scope.cases = [
    {
        "name": "test1",
        "steps": [
            {
                "description": "Navigate to the given URL.",
                "params": ["url"],
                "type": "get",
                "url": "${url}"
            },
            {
                "description": "Click an element on the current page.",
                "locator": {
                    "type": "id",
                    "value": "${id}"
                },
                "params": ["locator"],
                "type": "clickElement"
            },
            {
                "description": "Drags and drops an element onto another element.",
                "locator": {
                    "type": "id",
                    "value": "${source_locator}"
                },
                "targetLocator": {
                    "type": "id",
                    "value": "${desc_locator}"
                },
                "params": ["locator", "targetLocator"],
                "type": "dragToAndDropElement"
            }
        ]
      },
      {
        "name": "test2",
        "steps": [
            {
                "description": "Navigate to the given URL.",
                "params": ["url"],
                "type": "get",
                "url": "${variable_text}"
            },
            {
                "description": "Click an element on the current page.",
                "locator": {
                    "type": "id",
                    "value": "${locator_id}"
                },
                "params": ["locator"],
                "type": "clickElement"
            },
            {
                "description": "Drags and drops an element onto another element.",
                "locator": {
                    "type": "id",
                    "value": "${source_locator_id}"
                },
                "targetLocator": {
                    "type": "id",
                    "value": "${desc_locator_id}"
                },
                "params": ["locator", "targetLocator"],
                "type": "dragToAndDropElement"
            }
        ]
      }
    ];
    
    $scope.suites = [
      {
        'name':'NewSuite',
        'cases': []
      }
    ];

    $scope.fkWizardCompleteCallback = function(wizardData) {
        var projectName = wizardData.project_name;
        

      // $.smallBox({
      //   title: "Functional Keywords Framework",
      //   content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
      //   color: "#5F895F",
      //   iconSmall: "fa fa-check bounce animated",
      //   timeout: 4000
      // });
    };

  }]);
})