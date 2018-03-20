(function () {
    'use strict';

    angular.module('TVSMBranding')
    .factory('PageTitleService', ['$resource', '$http', function ($resource, $http) {
        var title = '';

        return {
            title: title
        };
    }]);
})();