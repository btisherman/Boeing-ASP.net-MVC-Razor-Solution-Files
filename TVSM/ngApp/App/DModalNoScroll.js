(function () {
    'use strict';

    angular.module('myApp')
    .directive('modalNoScroll', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.removeClass('modal-opened');

                scope.$on('modal-opened', function () {
                    element.addClass('modal-opened');
                })

                scope.$on('modal-closed', function () {
                    element.removeClass('modal-opened');
                })
                
            }
        }
    }]);


})();