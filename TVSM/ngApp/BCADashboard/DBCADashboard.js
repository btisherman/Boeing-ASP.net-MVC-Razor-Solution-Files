(function () {
    'use strict';

    angular.module('BCADashboard')
    .component('tvsmBcaDashboard', {
                templateUrl: server + '/ngApp/BCADashboard/partials/dashboard-partial.html',
                controller: ['filterToolsService', 'SearchService', 'BCADashboardDataService', '$scope', '$location', '$timeout', '$rootScope', '$window', '$q',
                    function (filterToolsService, SearchService, BCADashboardDataService, $scope, $location, $timeout, $rootScope, $window, $q) {
                        var vm = this;

                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.dataService = BCADashboardDataService;
                    vm.server = server;

                    vm.pieConfig = {
                        donutRatio: .55,
                        totalDescription: 'TOTAL COUNT'
                    }

                    vm.pieData = [
                        {
                            label: 'MES',
                            //data: {
                            //    Red: 116,
                            //    Green: 232,
                            //    Yellow: 19
                            //}
                        },
                        {
                            label: 'PAR',
                            //data: {
                            //    Red: 3,
                            //    Green: 2,
                            //    Yellow: 3
                            //}
                        },
                        {
                            label: 'TPM',
                            //data: {
                            //    Red: 0,
                            //    Green: 997,
                            //    Yellow: 12
                            //}
                        },
                        {
                            label: 'NCR',
                            //data: {
                            //    Red: 47,
                            //    Green: 45,
                            //    Yellow: 18
                            //}
                        }

                    ]

                    vm.pieData2 = [
                    {
                        label: 'IE'
                        
                    },
                    {
                        label: 'TME'
                        
                    },
                    {
                        label: 'TIA'
                        
                    },
                    {
                        label: 'ES'
                       
                    },
                    {
                        label: 'ENG',
                        name: 'TE'
                       
                    },
                    {
                        label: 'ETOM',
                        name: 'ETOM/Supplier Mgmt'
                 
                    }

                    ]

                    vm.pieClick = function (t) {
                        alert('Clicked ' + t + '!')
                    }

                    vm.filters = [
                    { display: 'Site Code', name: 'sites', field: 'Est Confirmed', label: function (field) { return field.BCA_Name + ' - ' + field.Site_Code }, valueAs: function (field) { return field.Site_Code }, trigger: true },
                    { display: 'Program', name: 'programs', field: 'Program', trigger: true},
                    { display: 'Group', name: 'workareas', field: 'Work Area', trigger: true },
                    { display: 'Work Location', name: 'activeworkareas', field: 'Active Work Area', trigger: true },
                    { display: false, field: 'Plan Status', defaultSelect: ['SFM'] }
                    ]

                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        getNewData();

                    })
                    
                    function getNewData() {
                        console.log('getting data', true);
                        vm.dataService.mes(vm.filterService.selected).then(function (res) {
                            vm.pieData.filter(function (pie) { return pie.label == 'MES' })[0].data = res.data;
                        }, function (err) { console.log('error', err); })
                        vm.dataService.held(vm.filterService.selected).then(function (res) {
                            console.log('held res', res);
                            angular.forEach(vm.pieData2, function (group) {
                                var name = group.name || group.label;
                                group.data = {};
                                angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                    var color = res.data.filter(function (item) {
                                        return item.Responsibility == name && item.Health == health;
                                    })[0];
                                    group.data[health] = color ? color.Qty || 0 : 0;
                                })
                            })
                        }, function (err) { console.log('error', err); })
                        vm.dataService.ar(vm.filterService.selected).then(function (res) {
                            var data = {}
                            angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                var color = res.data.filter(function (item) {
                                    return item.Health == health;
                                })[0];
                                data[health] = color ? color.Qty || 0 : 0;
                            })

                            vm.pieData.filter(function (pie) { return pie.label == 'PAR' })[0].data = data;
                        });
                        vm.dataService.ncr(vm.filterService.selected).then(function (res) {
                            var data = {}
                            angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                var color = res.data.filter(function (item) {
                                    return item.Health == health;
                                })[0];
                                data[health] = color ? color.Qty || 0 : 0;
                            })

                            vm.pieData.filter(function (pie) { return pie.label == 'NCR' })[0].data = data;
                        });
                    }


                }],
                controllerAs: 'vm'
            });
})();