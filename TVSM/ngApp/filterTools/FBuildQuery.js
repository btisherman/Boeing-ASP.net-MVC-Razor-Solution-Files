(function () {
    'use strict';

    angular.module('filterTools')
        .filter('buildQuery', function () {
            return function (input, field) {
                var query = '';
                if (input !== undefined && input.length) {
                    var map = input.map(function (selection) {
                        return field + " eq '" + selection + "'";
                    })
                    query = '(' + map.join(' or ') + ')';
                }
            return query;
        };
    });
})();