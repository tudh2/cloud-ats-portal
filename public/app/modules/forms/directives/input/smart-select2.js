define(['fk/module', 'select2'], function (module) {

    'use strict';

    module.registerDirective('smartSelect2', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                element.removeAttr('smart-select2 data-smart-select2');
                element.select2();
            }
        }
    });
});
