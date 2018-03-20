(function () {
    'use strict';

    angular.module('GlobalMetrics')
    .component('tvsmGlobalMetrics', {
                templateUrl: server + '/ngApp/GlobalMetrics/partials/main-partial.html',
                controller: ['filterToolsService', 'SearchService', 'GlobalMetricsDataService', '$scope', '$location', '$timeout', '$filter',
                    function (filterToolsService, SearchService, GlobalMetricsDataService, $scope, $location, $timeout, $filter) {
                        var vm = this;

                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.dataService = GlobalMetricsDataService;
                    vm.server = server;

                    vm.filters = [
                    { display: 'Site', name: 'sites', field: 'Site', trigger: true },
                    { display: 'Program', name: 'programs', field: 'Program', trigger: true}
                    ]

                    filterToolsService.values.Program = [];

                    vm.fieldNames = [
                        'Weight',
                        'Overall',
                        'Schedule',
                        'Quality',
                        'Cost',
                        'Forecast'
                    ]

                    vm.gaugeItems = [
                { icon: 'overall', label: 'Overall Performance', value: -1, trend: 1, topHeading: { text: 'Notional Data', color: 'red' } },
                { icon: 'calendar', label: 'Schedule Performance', value: -1, trend: 1, link: 
                    function () {
                        if (vm.filterService.selected.Site && vm.filterService.selected.Site[0]) {
                            var site = vm.filterService.selected.Site[0]
                            return 'http://nwp.web.boeing.com/dashboard/dashboard_GlobalMetric.asp?title=EVT Site&range=rolling&distype=parent&site=' + site;
                        } else {
                            return vm.server + '/#/globalmetrics'
                        } 
                    },
                topHeading: { text: 'Live Data', color: 'green' }
                },
                { icon: 'tool', label: 'Quality Performance', value: -1, trend: true, topHeading: { text: 'Notional Data', color: 'red' } },
                { icon: 'price', label: 'Cost Performance', value: -1, trend: -1, topHeading: { text: 'Notional Data', color: 'red' } },
                { icon: 'price', label: 'Forecast Performance', value: -1, trend: true, topHeading: { text: 'Notional Data', color: 'red' } }
                    ]

                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        getNewData();

                    })

                    getNewData();
                    
                    function getNewData() {
                        console.log('getting data', true);
                        vm.dataService.metrics(vm.filterService.selected).then(function (res) {
                            var obj = {}
                            if (res.data.length === 1) {
                                var item = res.data[0];
                                console.log('have 1', this);
                                vm.singleResult = true;

                                var gaugeFields = vm.fieldNames.slice(1);
                                for (var i = 0; i < gaugeFields.length; i++) {
                                    vm.gaugeItems[i].value = item[gaugeFields[i]]
                                }
                                vm.tableData = item;

                            } else {
                                console.log('have many', this);
                                vm.singleResult = false;
                                var groups = {}
                                angular.forEach(res.data, function (item) {
                                    if (!groups[item.Site]) {
                                        groups[item.Site] = { values: [item] }
                                    } else {
                                        groups[item.Site].values.push(item)
                                    }
                                });
                                angular.forEach(groups, function (value, key) {
                                    console.log(key, value);
                                    for (var i = 0; i < vm.fieldNames.length; i++) {
                                        var field = vm.fieldNames[i];
                                        value[field] = getAvg(value.values, field);
                                    }
                                })
                                vm.tableData = groups;

                                var gaugeFields = vm.fieldNames.slice(1);
                                for (var i = 0; i < gaugeFields.length; i++) {
                                    var field = gaugeFields[i];
                                    vm.gaugeItems[i].value = getAvg(res.data, field);
                                }

                                console.log(groups)
                            }
                            console.log(res)
                        }, function (err) { console.log('error', err); })
                    }

                    vm.legendValues = [
                        { value: 'POOR', color: '#253746', textcolor: '#FFF' },
                        { value: '1', color: '#EA002A', textcolor: '#FFF' },
                        { value: '2', color: '#EA002A', textcolor: '#FFF' },
                        { value: '3', color: '#EA002A', textcolor: '#FFF' },
                        { value: '4', color: '#FFA400', textcolor: '#000' },
                        { value: '5', color: '#FFA400', textcolor: '#000' },
                        { value: '6', color: '#FFA400', textcolor: '#000' },
                        { value: '7', color: '#FFA400', textcolor: '#000' },
                        { value: '8', color: '#81BC00', textcolor: '#FFF' },
                        { value: '9', color: '#81BC00', textcolor: '#FFF' },
                        { value: '10', color: '#81BC00', textcolor: '#FFF' },
                        { value: 'GOOD', color: '#253746', textcolor: '#FFF' }
                    ]

                    vm.getCellClass = function (value) {
                        if (value < 4) {
                            return 'cell-danger'
                        } else if (value < 7) {
                            return 'cell-warning'
                        } else {
                            return 'cell-success'
                        }
                    }

                    function getAvg(array, property) {
                        if (!array.length) {
                            return 0;
                        }
                        var sum = 0;
                        angular.forEach(array, function (item) {
                            var value = item[property] || 0;
                            sum += value;
                        });
                        var avg = sum / array.length;
                        return avg;
                    }

                }],
                controllerAs: 'vm'
            });
})();