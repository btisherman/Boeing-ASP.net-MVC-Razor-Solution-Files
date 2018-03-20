(function () {
    'use strict';

    angular.module('WIP')
    .directive('tvsmWipList', ['filterToolsService', 'SearchService', 'WipDataService', 'alertService',
        function (filterToolsService, SearchService, WipDataService, alertService) {
            return {
                restrict: 'AE',
                scope: {
                    gantt: '@'
                },
                templateUrl: server + '/ngApp/WIP/partials/wiplist-partial.html',
                controller: ['$scope', '$location', '$timeout', '$rootScope', function ($scope, $location, $timeout, $rootScope) {
                    var vm = this;
                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.dataService = WipDataService;
                    vm.route = function (path) {
                        $location.path(path);
                    }
                    vm.displayGantt = $scope.gantt;
                    vm.tools = WipDataService.tools;
                    vm.server = server;
                    vm.nextPage = WipDataService.more;
                    vm.filterRemote = {};
                    if ($location.search().id) {
                        vm.dataService.ids = $location.search().id.split(',')
                    }
                    if (WipDataService.ids && WipDataService.forceUpdate) {
                        WipDataService.forceUpdate = false;
                        getNewData(WipDataService.ids);
                        console.log('ids', WipDataService.ids)
                    }

                    vm.filters = [
                    { display: 'Site Code', name: 'sites', field: 'Est Confirmed', label: function (field) { return field.BCA_Name + ' - ' + field.Site_Code }, valueAs: function (field) { return field.Site_Code } },
                    { display: 'Program', name: 'programs', field: 'Program' },
                    { display: 'PST', name: 'psts', field: 'Area' },
                    { display: 'ACCP', name: 'accps', field: 'ACCP' },
                    { display: 'Project', name: 'projects', field: 'Tooling Project' },
                    { display: 'MES Status', name: 'messtatus', field: 'Plan Status', sort: {'UNV':1, 'SFM':2, 'COMP':3, 'CANC':4, 'DELETE':5}},
                    { display: 'Form Type', name: 'formtypes', field: 'Form Type', values: ['DESIGN', 'MFG', 'DETAIL'], subtext: { 'DETAIL': 'COMPONENT'} },
                    { display: 'Work Area', name: 'workareas', field: 'Work Area' },
                    { display: 'CCV', name: 'ccvs', field: 'Tool Type', trigger: true }
                    ]

                    if ((vm.filterService.resultCount && !vm.tools.length)) {
                        $timeout(function () {
                            //Use remote object used by filter directive, to cause pie chart update
                           vm.filterRemote.update();
                        }, 0) 
                    }

                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        getNewData();
                        
                    })

                    //$scope.$watch(function () { return vm.dataService.ids }, function (newVal) {
                    //    getNewData(newVal);
                    //});

                    vm.getMore = function () {
                        if (vm.nextPage) {
                            var tools = WipDataService.ids ? { "Order ID": WipDataService.ids } : vm.filterService.selected;
                            WipDataService.fromPost(tools, vm.nextPage).then(function (res) {
                                WipDataService.tools = WipDataService.tools.concat(res.data);
                                vm.tools = WipDataService.tools;
                                $timeout(function () {
                                    WipDataService.more = res.headers('X-Next-Page');
                                    vm.nextPage = WipDataService.more;
                                }, 0)
                                
                            }, function (err) { console.log('error', err); });
                            WipDataService.more = false;
                            vm.nextPage = WipDataService.more;
                        }
                    }

                    vm.getDetails = function (id) {
                        $location.path('/wip/' + id);
                    }

                    vm.toggleGantt = function () {
                        if (vm.displayGantt) {
                            //Already displaying gantt, switch to rows
                            $location.path('/wip')
                        } else {
                            //Switch to gantt view
                            $location.path('/wip/gantt')
                        }
                    }

                    vm.clickGanttLabel = function (d) {
                        $scope.$apply(function () {
                            $location.path('/wip/' + d['Order ID']);
                        })
                    }

                    vm.datePast = function (date) {
                        if (date) {
                            var result = new Date(date).getTime() - Date.now() <= 0 ? true : false;
                            return result;
                        } else {
                            return null;
                        }
                    }

                    vm.saveExcel = function () {
                        if (!vm.filterService.resultCount) {
                            alertService.addIf('danger', 'Must have list of tools to send to Excel');
                            return;
                        }
                        var form = document.createElement("form");
                        form.setAttribute("action", server + "/api/wip/excel"); //"/api/wip/excel");
                        form.setAttribute("method", "post");
                        form.setAttribute("target", "_self");

                        var index = 0;
                        angular.forEach(vm.filterService.selected, function (value, key) {
                            if (value && value.length) {
                                var hiddenEle1 = document.createElement("input");
                                hiddenEle1.setAttribute("type", "hidden");
                                hiddenEle1.setAttribute("name", key);
                                hiddenEle1.setAttribute("value", value.join());

                                form.appendChild(hiddenEle1);
                                index++;
                            }
                        });

                        document.body.appendChild(form)
                        form.submit();

                    }

                    function getNewData(ids) {
                        var tools = ids ? { "Order ID": ids } : vm.filterService.selected;
                        WipDataService.fromPost(tools).then(function (res) {
                            WipDataService.tools = res.data;
                            vm.tools = WipDataService.tools;
                            $timeout(function () {
                                WipDataService.more = res.headers('X-Next-Page');
                                vm.nextPage = WipDataService.more;
                            }, 0)
                        }, function (err) { console.log('error', err); })
                    }



                }],
                controllerAs: 'vm'
            }
        }]);


})();