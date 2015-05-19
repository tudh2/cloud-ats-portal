define(['layout/module'], function(app) {
  "use strict";

  app.registerDirective('languageSelector', function(Language) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'app/components/language/language-selector.tpl.html',
      scope: true
    };
  });
});