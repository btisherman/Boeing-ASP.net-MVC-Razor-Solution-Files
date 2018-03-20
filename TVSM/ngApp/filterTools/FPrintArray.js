(function () {
    'use strict';

    angular.module('filterTools')
        .filter('printArray', function () {
            return function (arr) {
                if (!angular.isArray(arr)) {
                    return arr;
                }
                return arr.join(', ');
            };
        });   
})();