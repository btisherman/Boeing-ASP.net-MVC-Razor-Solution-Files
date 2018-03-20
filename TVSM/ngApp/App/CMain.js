(function () {
    angular.module('myApp')
        .controller('mainCtrl', ['SearchService','alertService', 'filterToolsService', '$location', '$timeout',
            function (SearchService, alertService, filterToolsService, $location, $timeout) {
                var vm = this;
                vm.filterService = filterToolsService;
                vm.server = server;

                vm.searchSvc = SearchService;

                vm.filters = [
                    { display: 'Site Code', name: 'sites', field: 'Est Confirmed', label: function (field) { return field.BCA_Name + ' - ' + field.Site_Code }, valueAs: function (field) { return field.Site_Code }},
                    { display: 'Program', name: 'programs', field: 'Program' },
                    { display: 'PST', name: 'psts', field: 'Area' },
                    { display: 'ACCP', name: 'accps', field: 'ACCP' },
                    { display: 'Project', name: 'projects', field: 'Tooling Project' },
                    { display: 'MES Status', name: 'messtatus', field: 'Plan Status', sort: { 'UNV': 1, 'SFM': 2, 'COMP': 3, 'CANC': 4, 'DELETE': 5 } },
                    { display: 'Form Type', name: 'formtypes', field: 'Form Type', values: ['DESIGN', 'MFG', 'DETAIL'], subtext: { 'DETAIL': 'COMPONENT' } },
                    { display: 'Work Area', name: 'workareas', field: 'Work Area' },
                    { display: 'CCV', name: 'ccvs', field: 'Tool Type', trigger: true }
                ]

                vm.gaugeItems = [
                    { label: 'Tooling Overall', value: 5},
                    { label: 'Tooling Performance', value: 5 },
                    { label: 'Design and Build Quality', value: 5},
                    { label: 'Delivery Discipline', value: 5},
                    { label: 'Actual vs. Estimate Performance', value: 5 }
                ]

                vm.route = $location;
        }
        ]);
})();