define(['keyword/module', 'jquery'], function (module, jQuery) {
  'use strict';

  jQuery.event.props.push('dataTransfer');

  module.registerFactory('uuid', function() {
    var svc = {
      new : function() {
        function _p8(s) {
          var p = (Math.random().toString(16)+"000000000").substr(2,8);
          return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
      },
      empty: function() {
        return '00000000-0000-0000-0000-000000000000';
      }
    };

    return svc;
  });

  module.registerDirective('smartDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        angular.element(el).attr("draggable", "true");
        var id = angular.element(el).attr("id");
        if (!id) {
          id = uuid.new()
          angular.element(el).attr("id", id);
        }

        el.bind("dragstart", function (e) {
          e.dataTransfer.setData('text', id);
          $rootScope.$emit("SMART-DRAG-START");
        });

        el.bind("dragend", function (e) {
          $rootScope.$emit("SMART-DRAG-END");
        });
      }
    }
  }]);

  module.registerDirective('smartDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
      restrict: 'A',
      scope: {
        onDrop: '&'
      },
      link: function(scope, el, attrs) {
        var id = angular.element(el).attr("id");
        if (!id) {
          id = uuid.new();
          angular.element(el).attr("id", id);
        }

        el.bind("dragover", function (e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
          return false;
        });

        el.bind("dragenter", function (e) {
          // this / e.target is the current hover target.
          angular.element(e.target).addClass('smart-over');
        });

        el.bind("dragleave", function (e) {
          angular.element(e.target).removeClass('smart-over');  // this / e.target is previous target element.
        });

        el.bind("drop", function (e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
          }

          var data = e.dataTransfer.getData("text");
          var dest = document.getElementById(id);
          var src = document.getElementById(data);

          scope.onDrop({dragEl: data, dropEl: id});
        });

        $rootScope.$on("SMART-DRAG-START", function () {
          var el = document.getElementById(id);
          angular.element(el).addClass("smart-target");
        });

        $rootScope.$on("SMART-DRAG-END", function () {
          var el = document.getElementById(id);
          angular.element(el).removeClass("smart-target");
          angular.element(el).removeClass("smart-over");
        });
      }
    }
  }]);
});