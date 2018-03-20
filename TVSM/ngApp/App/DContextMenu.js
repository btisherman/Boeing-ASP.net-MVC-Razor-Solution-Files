(function () {
    'use strict';

    angular.module('myApp')
    .directive('fieldDisplay', [function () {
        return {
            restrict: 'AE',
            scope: {
                obj: '=',
                field: '@'
            },
            template: '<span>{{display}}</span>',
            replace: true,
            link: function (scope, element, attr) {
                scope.display = scope.obj[scope.field];
                element.on('contextmenu.dirContextMenu', function (evt) {
                    evt.preventDefault();
                    console.log('field', {obj: scope.obj, field: scope.field, display: scope.display})

                })
            }
        }
    }
    ]);


})();