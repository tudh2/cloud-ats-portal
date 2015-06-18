define(['layout/module', 'bootstrap-slider'], function (module) {

    'use strict';

    return module.registerDirective('smartUislider', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, tElement, tAttributes) {
                tElement.removeAttr('smart-uislider data-smart-uislider');

                tElement.bootstrapSlider();
                
                $(tElement.data('bootstrapSlider').sliderElem).prepend(tElement)
            }
        }
    });
});
