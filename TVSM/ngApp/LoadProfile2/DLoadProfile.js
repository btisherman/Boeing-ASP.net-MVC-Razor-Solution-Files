(function () {
    'use strict';

    angular.module('LoadProfile2', ['filterTools', 'miscSearch'])
    .directive('tvsmLoadProfile2', ['filterToolsService', 'SearchService', 'LoadProfileDataService2', '$location',
    function (filterToolsService, SearchService, LoadProfileDataService2, $location) {
            return {
                restrict: 'AE',
                templateUrl: server + '/ngApp/LoadProfile2/partials/loadprofile-partial.html',
                controller: ['$scope', '$filter', function ($scope, $filter) {
                    var vm = this;
                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.categories = LoadProfileDataService2.categories;
                    vm.tableauRemote = {};

                    vm.filters = [
                        { display: 'Program', field: 'Program' , trigger: true},
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

                    $scope.$on('tvsm-filter-changed', function () {
                        vm.tableauRemote.setFilter(vm.filterService.selected.Program[0]);
                    })

                    vm.getNewData = function () {
                        LoadProfileDataService2.tools(vm.timeGroup.value, vm.filterService.tools).then(function (res) {
                            vm.data = res.data//spreadData(res);
                            calculateChart(vm.data);
                        }, function (err) { console.log('error', err); })
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

                }],
                controllerAs: 'vm',
                link: function (scope, el, attr) {
                    scope.tableauRemote = {};
                }
            }
        }]);


})();