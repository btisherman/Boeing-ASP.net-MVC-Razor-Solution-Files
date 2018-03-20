(function () {
    'use strict';

    angular.module('OpenSOW')
        .filter('parseDate', ['$filter', function ($filter) {
            return function (dateString, format) {
                var date = new Date(dateString);
                if (!isNaN(date.getDate())) {
                    return $filter('date')(date, format);
                } else {
                    return dateString;
                }
            };
        }]);
})();