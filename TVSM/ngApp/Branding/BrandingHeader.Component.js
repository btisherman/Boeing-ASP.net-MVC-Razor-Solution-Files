(function () {
    'use strict';

    angular.module('TVSMBranding')
    .component('brandingHeader', {
        templateUrl: server + '/ngApp/Branding/partials/page-title-partial.html',
        controller: ['$scope',
            function ($scope) {
                var vm = this;

                vm.server = server;
            }],
        controllerAs: 'vm'
    });
})();