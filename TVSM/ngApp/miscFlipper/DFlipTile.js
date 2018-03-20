(function () {
    'use strict';

    angular.module('miscFlipper')

    .directive("flipper", function () {
        return {
            restrict: "E",
            template: "<div class='flipper' ng-transclude ng-class='{ flipped: flipped }'></div>",
            transclude: true,
            scope: {
                flipped: "="
            }
        };
    })

    .directive("front", function () {
        return {
            restrict: "E",
            template: "<div class='front tile' ng-transclude></div>",
            transclude: true
        };
    })

    .directive("back", function () {
        return {
            restrict: "E",
            template: "<div class='back tile' ng-transclude></div>",
            transclude: true
        }
    });

    //.directive('flipTile', [ '$q',
    //    function ($q) {
    //        return {
    //            restrict: 'A',
    //            scope: {
    //                exportPdf: '=',
    //                busy: '=',
    //                options: '<',
    //                pdfClass: '@'
    //            },
    //            transclude: {
    //                'front': 'front',
    //                'back': 'back'
    //            },
    //            link: function (scope, el, attrs) {


    //                scope.remote = scope.exportPdf || {};
    //                scope.remote.export = function () {
    //                    console.log('creating pdf', el);
    //                    createAndExportPDF();
    //                }

    //            },
    //            controllerAs: 'vm'
    //        }
    //    }]);


})();