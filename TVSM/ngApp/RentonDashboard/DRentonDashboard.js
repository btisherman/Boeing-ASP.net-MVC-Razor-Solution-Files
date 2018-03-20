(function () {
    'use strict';

    angular.module('BCADashboard')
    .component('tvsmRentonDashboard', {
                templateUrl: server + '/ngApp/RentonDashboard/partials/dashboard-partial.html',
                controller: ['filterToolsService', 'SearchService', 'RentonDashboardDataService', '$scope', '$location', '$timeout', '$rootScope', '$window', '$q', 'WipDataService',
                    function (filterToolsService, SearchService, RentonDashboardDataService, $scope, $location, $timeout, $rootScope, $window, $q, WipDataService) {
                        var vm = this;

                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.dataService = RentonDashboardDataService;
                    vm.server = server;
                    vm.summaryData = {}

                    $scope.$watch($location.search(), function (newVal) {
                        console.log('new value', newVal)
                    });

                    console.log($location.search());
                    vm.showPercentage = ($location.search().percent && $location.search().percent != 'false') || false;
                    vm.area = $location.search().area || 'all';
                    setHeading(vm.area);

                    vm.pieConfig = {
                        donutRatio: .55,
                        totalDescription: 'TOTAL COUNT',
                        showPercentage: vm.showPercentage
                    }

                    vm.pieData = [
                        {
                            label: 'MES',
                            //data: {
                            //    Red: 116,
                            //    Green: 232,
                            //    Yellow: 19
                            //}
                            legend: {
                                Green: 'Orders due more than 7 days from today.',
                                Yellow: 'Orders due less than 7 days from today.',
                                Red: 'Overdue orders.'
                            }
                        },
                        {
                            label: 'PAR',
                            legend: {
                                Green: 'PARs aged up to 5 days.',
                                Yellow: 'PARs aged over 5 days.',
                                Red: 'PARs aged over 8 days'
                            }
                        },
                        {
                            label: 'TPM',
                            legend: {
                                Green: 'TPMs due next month.',
                                Yellow: 'TPMs due this month.',
                                Red: 'TPMs overdue.'
                            }
                        },
                        {
                            label: 'NCO',
                            legend: {
                                Green: 'NCOs aged up to 20 days.',
                                Yellow: 'NCOs aged over 20 days.',
                                Red: 'NCOs aged over 30 days'
                            }
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
                        name: 'ETOM'
                 
                    }

                    ]

                    vm.pieClick = function (t, l) {
                        console.log('clicked!', t, l);
                        switch (l) {
                            case 'MES':
                                vm.dataService.orders(vm.area, t.data.key).then(function (res) {
                                    console.log('orders res', res);
                                    WipDataService.ids = res.data;
                                    WipDataService.forceUpdate = true;
                                    filterToolsService.displayFilter = false;
                                    $location.url('/wip');
                                }, function (err) { console.log('error', err); });
                                break;
                            case 'PAR':
                                vm.dataService.arFromHealth(vm.area, t.data.key).then(function (res) {
                                    console.log('par res', res);
                                    vm.parModalData = res.data;
                                    $('#parModal').modal('show')
                                }, function (err) { console.log('error', err); });
                                    break;
                            case 'TPM':
                                vm.dataService.tipsFromHealth(vm.area, t.data.key).then(function (res) {
                                    console.log('tips res', res);
                                    vm.tpmModalData = res.data;
                                    $('#tpmModal').modal('show')
                                }, function (err) { console.log('error', err); });
                                break;
                           case 'NCO':
                                    vm.dataService.ncoFromHealth(vm.area, t.data.key).then(function (res) {
                                        console.log('nco res', res);
                                        vm.ncoModalData = res.data;
                                        $('#ncoModal').modal('show')
                                    }, function (err) { console.log('error', err); })
                                    break;
                            default:
                                if (l.substring(0, 3) === 'HF_') {
                                    console.log('held for clicked')
                                    var responsible = l.substring(3)
                                    vm.dataService.heldorders(vm.area, responsible, t.data.key).then(function (res) {
                                        console.log('orders res', res);
                                        WipDataService.ids = res.data;
                                        WipDataService.forceUpdate = true;
                                        filterToolsService.displayFilter = false;
                                        $location.url('/wip');
                                    }, function (err) { console.log('error', err); });
                                }
                                console.log('clicked something else');
                        }
                        }

                    vm.togglePercentage = function () {
                        $location.search('percent', vm.showPercentage ? null : true)
                        vm.showPercentage = $location.search().percent || false;
                        vm.pieConfig.showPercentage = vm.showPercentage;      
                    }

                    vm.setArea = function (area) {
                        //if area is all then remove query string, otherwise set it
                        vm.area = area;
                        var areaProperty = area == 'all' ? null : area;
                        $location.search('area', areaProperty);
                        setHeading(area);
                        getNewData();
                    }


                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        getNewData();

                    })
                    getNewData();
                    
                    function setHeading(area) {
                        switch (vm.area) {
                            case 'wings':
                                vm.heading = 'Renton Wings (Area 3)';
                                break;
                            case 'final':
                                vm.heading = 'Renton Final Assembly (Area 9)';
                                break;
                            case 'backshop':
                                vm.heading = 'Renton Back Shops';
                                break;
                            default:
                                vm.heading = 'Renton Wings and Final Assembly';
                        }
                    }

                    function getNewData() {
                        vm.dataService.mes(vm.area).then(function (res) {
                            vm.pieData.filter(function (pie) { return pie.label == 'MES' })[0].data = res.data;
                        }, function (err) { console.log('error', err); })
                        vm.dataService.heldsummary(vm.area).then(function (res) {
                            vm.summaryData = res.data;
                        }, function (err) { console.log('error', err); })
                        vm.dataService.held(vm.area).then(function (res) {
                            var nest = d3.nest()
                            .key(function (d) { return d.Responsibility })
                            .entries(res.data);

                            //angular.forEach(vm.pieData2, function (group) {
                            //    var name = group.name || group.label;
                            //    group.data = {};
                            //    angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                            //        var color = res.data.filter(function (item) {
                            //            return item.Responsibility == name && item.Health == health;
                            //        })[0];
                            //        group.data[health] = color ? color.Qty || 0 : 0;
                            //    })
                            //})
                            vm.pieData2 = [];
                            angular.forEach(nest, function (group) {
                                var item = {}
                                item.label = group.key === 'null' ? 'None' : group.key
                                if (item.label === 'None') {
                                    console.log('None shown');
                                    return;
                                }
                                item.data = {};
                                angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                    var color = group.values.filter(function (item) {
                                        return item.Health == health;
                                    })[0];
                                    item.data[health] = color ? color.Qty || 0 : 0;
                                })
                                vm.pieData2.push(item);
                            })
                        }, function (err) { console.log('error', err); })
                        vm.dataService.ar(vm.area).then(function (res) {
                            var data = {}
                            angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                var color = res.data.filter(function (item) {
                                    return item.Health == health;
                                })[0];
                                data[health] = color ? color.Qty || 0 : 0;
                            })

                            vm.pieData.filter(function (pie) { return pie.label == 'PAR' })[0].data = data;
                        });
                        vm.dataService.tips(vm.area).then(function (res) {
                            var data = {}
                            angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                var color = res.data.filter(function (item) {
                                    return item.Health == health;
                                })[0];
                                data[health] = color ? color.Qty || 0 : 0;
                            })

                            vm.pieData.filter(function (pie) { return pie.label == 'TPM' })[0].data = data;
                        });
                        vm.dataService.nco(vm.area).then(function (res) {
                            var data = {}
                            angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                                var color = res.data.filter(function (item) {
                                    return item.Health == health;
                                })[0];
                                data[health] = color ? color.Qty || 0 : 0;
                            })

                            vm.pieData.filter(function (pie) { return pie.label == 'NCO' })[0].data = data;
                        });
                        //vm.dataService.ncr(vm.filterService.selected).then(function (res) {
                        //    var data = {}
                        //    angular.forEach(['Red', 'Yellow', 'Green'], function (health) {
                        //        var color = res.data.filter(function (item) {
                        //            return item.Health == health;
                        //        })[0];
                        //        data[health] = color ? color.Qty || 0 : 0;
                        //    })

                        //    vm.pieData.filter(function (pie) { return pie.label == 'NCR' })[0].data = data;
                        //});
                    }

                    vm.summaryTotal = function () {
                        var sum = 0;
                        sum += vm.summaryData.Green || 0;
                        sum += vm.summaryData.Yellow || 0;
                        sum += vm.summaryData.Red || 0;

                        return sum;
                    }

                    vm.getSummaryOrders = function (health) {
                        if (vm.summaryData[health] == 0) {
                            return;
                        }
                        vm.dataService.heldsummaryorders(vm.area, health).then(function (res) {
                            console.log('orders res', res);
                            WipDataService.ids = res.data;
                            WipDataService.forceUpdate = true;
                            filterToolsService.displayFilter = false;
                            $location.url('/wip');
                        }, function (err) { console.log('error', err); });
                    }


                }],
                controllerAs: 'vm'
            });
})();