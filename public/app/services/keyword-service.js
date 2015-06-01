define(['fk/module'], function(module) {
  'use strict';

  module.registerFactory('KeywordService', ['$http', function($http) {
    return {
      getKeywords: function(callback) {
        $http.get('api/keywords.json').success(function(data) {
          if (typeof callback === 'function') {
            callback(data);
          }
        });
      }
    }
  }]);
});