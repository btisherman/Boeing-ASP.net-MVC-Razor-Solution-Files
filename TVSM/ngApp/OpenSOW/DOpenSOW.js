(function () {
    'use strict';

    angular.module('OpenSOW')
    .component('tvsmOpenSow', {
                bindings: {
                    id: '@'
                },
                templateUrl: server + '/ngApp/OpenSOW/partials/opensow-partial.html',
                controller: ['filterToolsService', 'SearchService', 'OpenSOWDataService', 'alertService', '$scope', '$location', '$timeout', '$rootScope', '$window', '$q',
                    function (filterToolsService, SearchService, OpenSOWDataService, alertService, $scope, $location, $timeout, $rootScope, $window, $q) {
                        var vm = this;

                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.dataService = OpenSOWDataService;
                    vm.server = server;

                    vm.tools = vm.dataService.tools;
                    vm.hours = vm.dataService.hours;
                    vm.nextPage = vm.dataService.more;

                    vm.filters = [
                    { display: 'Program', field: 'ProgramX' },
                    { display: 'PST', field: 'PST', trigger: true}
                    ]

                    $scope.$on('tvsm-filter-changed', function () {
                        console.log('filter changed');
                        getNewData();

                    })
                    
                    vm.dataService.ids.changed.then(null, null, function (ids) {
                        vm.ids = ids;
                        getNewData(ids);
                    });


                    vm.getToolDetails = function (id) {
                        $location.path('/opensow/' + id);
                    }

                    vm.getMultiple = function (any) {
                        var toolsToPrint = vm.tools.filter(function (tool) {
                            return tool.print;
                        });
                        if (any) {
                            return toolsToPrint.length;
                        }
                        vm.dataService.toolsToPrint = toolsToPrint;
                        $location.path('/opensow/multi');
                    }

                    vm.clearPrint = function () {
                        vm.tools.forEach(function (tool) {
                            tool.print = false;
                        })
                    }


                    vm.saveExcel = function () {
                        if (!vm.filterService.resultCount && !vm.ids) {
                            alertService.addIf('danger', 'Must have list of tools to send to Excel');
                            return;
                        }
                        var form = document.createElement("form");
                        form.setAttribute("action", server + "/api/opensow/excel");
                        form.setAttribute("method", "post");
                        form.setAttribute("target", "_self");

                        var hiddenEle1 = document.createElement("input");
                        hiddenEle1.setAttribute("type", "hidden");
                        hiddenEle1.setAttribute("name", "Program");
                        hiddenEle1.setAttribute("value", vm.filterService.selected.ProgramX || '');

                        var hiddenEle2 = document.createElement("input");
                        hiddenEle2.setAttribute("type", "hidden");
                        hiddenEle2.setAttribute("name", "Area");
                        hiddenEle2.setAttribute("value", vm.filterService.selected.PST || '');

                        var hiddenEle3 = document.createElement("input");
                        hiddenEle3.setAttribute("type", "hidden");
                        hiddenEle3.setAttribute("name", "Tool");
                        hiddenEle3.setAttribute("value", vm.ids || '');

                        document.body.appendChild(form)
                        form.appendChild(hiddenEle1);
                        form.appendChild(hiddenEle2);
                        form.appendChild(hiddenEle3);

                        form.submit();

                    }

                    vm.getMore = function () {
                        if (vm.nextPage) {
                            var tools = vm.ids ? { Tool: vm.ids } : vm.filterService.selected;
                            OpenSOWDataService.fromPost(tools, vm.nextPage).then(function (res) {
                                OpenSOWDataService.tools = OpenSOWDataService.tools.concat(res.data);
                                vm.tools = OpenSOWDataService.tools;
                                $timeout(function () {
                                    OpenSOWDataService.more = res.headers('X-Next-Page');
                                    vm.nextPage = OpenSOWDataService.more;

                                    if (vm.tools.length === vm.hours[0].Qty) {
                                        OpenSOWDataService.more = false;
                                        vm.nextPage = OpenSOWDataService.more;
                                    }
                                }, 0)

                            }, function (err) { console.log('error', err); });
                            OpenSOWDataService.more = false;
                            vm.nextPage = OpenSOWDataService.more;
                        }
                    }

                    function getNewData(ids) {
                        var deferred = $q.defer(), resolvedPromises = 0;
                        var tools = ids ? { Tool: ids } : vm.filterService.selected;
                        OpenSOWDataService.fromPost(tools).then(function (res) {
                            vm.tools = res.data;
                            vm.dataService.tools = res.data;
                            resolvedPromises++;
                            if (resolvedPromises === 2) {
                                deferred.resolve();
                            }
                            $timeout(function () {
                                OpenSOWDataService.more = res.headers('X-Next-Page');
                                vm.nextPage = OpenSOWDataService.more;
                            }, 0)
                        }, function (err) { console.log('error', err); })
                        OpenSOWDataService.getHours(tools).then(function (res) {
                            vm.hours = res.data;
                            vm.dataService.hours = res.data;
                            resolvedPromises++;
                            if (resolvedPromises === 2) {
                                deferred.resolve();
                            }
                        }, function (err) { console.log('error', err); })

                        //both server requests have returned
                        deferred.promise.then(function () {
                            if (vm.tools.length === vm.hours[0].Qty) {
                                $timeout(function () {
                                    OpenSOWDataService.more = false;
                                    vm.nextPage = OpenSOWDataService.more; 
                                },0)
                                    
                            }
                        })
                    }


                }],
                controllerAs: 'vm'
            });
})();