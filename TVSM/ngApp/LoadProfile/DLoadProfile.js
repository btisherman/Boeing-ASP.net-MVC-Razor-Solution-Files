(function () {
    'use strict';

    angular.module('LoadProfile', ['filterTools', 'miscSearch', 'nvd3'])
    .directive('tvsmLoadProfile', ['filterToolsService', 'SearchService', 'LoadProfileDataService', '$location',
    function (filterToolsService, SearchService, LoadProfileDataService, $location) {
            return {
                restrict: 'AE',
                templateUrl: server + '/ngApp/LoadProfile/partials/loadprofile-partial.html',
                controller: ['$scope', '$filter', function ($scope, $filter) {
                    var vm = this;
                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.categories = LoadProfileDataService.categories;

                    vm.filters = [
                        { display: 'Program', field: 'Program' },
                        { display: 'Work Area', field: 'Work Area' },
                        { display: 'Assigned Name', field: 'Responsible', trigger: true, width: '200px' },
                        { display: false, field: 'Plan Status', defaultSelect: ['SFM'] }
                    ]

                    vm.timeGroups = [
                        { name: 'Month', display: 'MMM yy', value: 'M' },
                        { name: 'Week', display: 'dd MMM', value: 'W' }
                       // { name: 'Days', interval: 'day', display: 'dd MMM'}
                    ];
                    vm.timeGroup = vm.timeGroups[0];
                    vm.tools = [];
                    vm.data = [];

                    //vm.getTimeRange = function () {
                    //    var todayRounded = d3.time[vm.timeGroup.interval].floor(new Date())
                    //    var rangeEnd = d3.time[vm.timeGroup.interval].offset(todayRounded, 25)
                    //    vm.range = d3.time[vm.timeGroup.interval].range(todayRounded, rangeEnd);
                    //    calculateChart(vm.data);
                    //}

                    //vm.getTimeRange();

                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        vm.getNewData();
                    })

                    vm.getNewData = function () {
                        LoadProfileDataService.getIds(vm.filterService.selected).then(function (res) {
                            LoadProfileDataService.tools(vm.timeGroup.value, res.data).then(function (res) {
                                vm.data = res.data//spreadData(res);
                                calculateChart(vm.data);
                            }, function (err) { console.log('error', err); })
                        })
                    }

                    function calculateChart(res) {
                        vm.range = d3.nest().key(function (d) { return d.Date }).entries(res).map(function (nestItem) { return new Date(nestItem.key) });
                        var nest = d3.nest()
                            .key(function (d) { return d.CCV})
                            //.key(function (d) { return d3.time[vm.timeGroup.interval].floor(new Date(d.end)) })
                            .entries(res);

                        var test = vm.categories.map(function (rangeCategory) {
                            var filtered = nest.filter(function (data) {
                                var result = data.key == rangeCategory.name.toUpperCase();
                                return result
                            });
                            filtered = filtered.length ? filtered[0].values : filtered;
                            return {
                                key: rangeCategory.name,
                                color: rangeCategory.color || null,
                                total: d3.sum(filtered, function (d) { return d.TotalHrs }),
                                //values: d3.nest()
                                //        .key(function (d) { return new Date(d.Date) })
                                //        .rollup(function (leaves) {
                                //            return {
                                //                total: d3.sum(leaves, function (d) { return d.TotalHrs }),

                                //            }
                                //        })
                                //        .entries(filtered)
                                values: vm.range.map(function (rangeDate) {
                                    var nest2 = d3.nest()
                                        .key(function (d) { return new Date(d.Date) })//d3.time[vm.timeGroup.interval].floor(new Date(d.Date)) })
                                        .entries(filtered);
                                    var filtered2 = nest2.filter(function (data) {
                                        var result = new Date(data.key).getTime() === new Date(rangeDate).getTime()
                                        return result
                                    });
                                    filtered2 = filtered2.length ? filtered2[0].values : filtered2;
                                        return {
                                            key: rangeDate,
                                            total: d3.sum(filtered2, function (d) { return d.TotalHrs }),
                                            values: filtered2
                                        }
                                    })
                            }
                        })
                        vm.tools = test;
                        console.log('tools', vm.tools);
                    }

                    vm.sumDate = function (date) {
                        var filter = vm.data.filter(function (row) { return new Date(row.Date).getTime() === new Date(date).getTime(); });
                        var sum = d3.sum(filter, function(d){ return d.TotalHrs})
                        return sum
                    }

                    vm.getWIP = function (ids) {
                        console.log('ids', ids);
                        vm.filterService.tools = ids;
                        $location.path('/wip')
                    }
                    //function spreadData(data) {
                    //    var result = [];
                    //    for (var iRow = 0; iRow < data.length; iRow++) {
                    //        var row = data[iRow];
                    //        if (row.start && row.end) {
                    //            var startRounded = d3.time.thursday.floor(new Date(row.start))
                    //            var endRounded = d3.time.thursday.floor(new Date(row.end))
                    //            var range = d3.time.thursday.range(startRounded, endRounded);
                    //            var hoursPerWeek = row.btg / range.length
                    //            for (var iRange = 0; iRange < range.length; iRange++) {
                    //                var currentRange = range[iRange];
                    //                result.push({
                    //                    orderID: row.orderID,
                    //                    end: currentRange,
                    //                    type: row.type,
                    //                    btg: hoursPerWeek
                    //                });
                    //            }
                    //        }
                    //    }
                    //    return result;
                    //}

                    vm.chartOptions = {
                        chart: {
                            type: 'stackedAreaChart',
                            height: 450,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 60
                            },
                            x: function (d) { return new Date(d.key); },
                            y: function (d) { return d.total; },
                            useVoronoi: false,
                            clipEdge: true,
                            duration: 100,
                            useInteractiveGuideline: true,
                            showControls: false,
                            xAxis: {
                                showMaxMin: false,
                                tickFormat: function (d) {
                                    return $filter('date')(d, vm.timeGroup.display);
                                },
                                tickValues: function () { return vm.range },
                                axisLabel: 'Date'
                            },
                            yAxis: {
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                },
                                axisLabel: 'Hours'
                            },
                            zoom: {
                                enabled: false,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: true,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        }
                    };

                }],
                controllerAs: 'vm'
            }
        }]);


})();