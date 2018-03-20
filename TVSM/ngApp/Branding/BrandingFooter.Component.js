(function () {
    'use strict';

    angular.module('TVSMBranding')
    .component('brandingFooter', {
        templateUrl: server + '/ngApp/Branding/partials/brandingfooter-partial.html',
        controller: [
            function () {
                var vm = this;

                vm.ccvs = [
                    'SAFETY',
                    'COMMITTED',
                    'ENG CHANGE',
                    'IMPROVEMENT',
                    'REMAKE',
                    'SUSTAINING',
                    'STUDY',
                    'ROUTINE',
                    'TPM'
                ]
            }],
        controllerAs: 'vm'
    });
})();