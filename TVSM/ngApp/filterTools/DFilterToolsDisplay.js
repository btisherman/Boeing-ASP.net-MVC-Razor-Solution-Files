(function () {
    'use strict';

    angular.module('filterTools')
    .directive('tvsmFilterTools', ['DataService', '$filter', 'filterToolsService', '$rootScope',
        function (DataService, $filter, filterToolsService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: server + '/ngApp/filterTools/partials/filtertoolsdirective-partial.html',
                transclude: {
                    'head': '?moduleHead',
                    'filters': '?moduleFilters',
                    'body': '?moduleBody',
                    'summary': '?moduleSummary',
                    'footer': '?moduleFooter'
                },
                scope: {
                    filters: '=',
                    specialFields: '@',
                    table: '@',
                    control: '=',
                    fillfirst: '@'
                },
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    var vm = this;
                    vm.filterService = filterToolsService;
                    vm.selected = filterToolsService.selected;
                    vm.values = filterToolsService.values;
                    vm.templates = DataService.templates.get();
                    vm.selectedTemplate = filterToolsService.template;
                    vm.fields = $scope.filters;
                    vm.specialFields = $scope.specialFields;
                    vm.pieData = filterToolsService.pieData;
                    vm.resultCount = vm.filterService.resultCount || 0;

                    vm.currentTable = $scope.table || 'tvsm';

                    if (!$scope.table) {
                        DataService.postFields("site").then(function (res) {
                            vm.values['Est Confirmed'] = res.data;
                        });
                        vm.values.Program = DataService.programs.get();
                    } else if ($scope.table == 'opensow') {
                        vm.values.ProgramX = DataService.programs.get();
                    }

                    if ($scope.fillfirst) {
                        getFilterValues(0);
                    }

                    var remote = $scope.control || {};
                    remote.update = function () {
                        getPieData();
                    }
                    if (filterToolsService.resultCount && vm.specialFields) {
                        getPieData();
                    }

                    vm.setSelect = function (index) {
                            angular.extend(filterToolsService.template, vm.templates[index]);
                            angular.extend(filterToolsService.values, vm.selectedTemplate.values);
                            angular.extend(filterToolsService.selected, vm.selectedTemplate.selected);

                            vm.updateCheckBoxes = !vm.updateCheckBoxes;
                            vm.predefined = !vm.predefined;
                            vm.runQuery();
                    }

                    vm.executeFieldQuery = function (index) {
                        clearObject(vm.selectedTemplate);
                        var currentField = vm.fields[index];
                        if (currentField.trigger == true) {
                            $timeout(function () {
                                vm.runQuery(true);
                            }, 0, false)
                        } else {
                            $timeout(function () {
                                vm.runQuery();
                            }, 0, false)
                        }

                        if (index + 1 !== vm.fields.length) {
                            clearDownstream(index);
                            $timeout(function () {
                                getFilterValues(index + 1)
                            }, 0, false);

                        }
                    }

                    vm.clearSelection = function (index) {
                        clearObject(vm.selectedTemplate);
                        var fields = vm.fields;
                        var currentField = fields[index];
                        vm.selected[currentField.field] = [];
                        clearDownstream(index);
                        
                    }

                    vm.runQuery = function (broadcast) {
                        DataService.getSelectionCount(vm.currentTable, vm.filterService.selected)//queryInContext())
                            .then(function (res) {
                                vm.filterService.resultCount = res.data;
                                vm.resultCount = res.data;
                                
                                if (broadcast) {
                                    $rootScope.$broadcast('tvsm-filter-changed');
                                }
                                if (vm.specialFields  && !vm.filterService.selected['Order Start Status']) {
                                    getPieData();
                                }

                            }, function (err) {
                                console.log('error', err);
                            })

                    }

                    vm.pieClick = function (tools, cat) {
                        //filterToolsService.tools = tools;
                        if (cat) {
                            vm.selected['Order Start Status'] = [cat];
                        } else {
                            vm.selected['Order Start Status'] = [];
                        }
                        vm.runQuery(true);
                    }

                    function getFilterValues(index) {
                        var targetField = vm.fields[index];
                        DataService.getFieldValues(vm.currentTable, targetField.field, queryInContext()).then(function (res) {
                            var val = res.data;
                            if (targetField.sort) {
                                val.sort(function (a, b) {
                                    return (targetField.sort[a] || 10) - (targetField.sort[b] || 10)
                                });
                            }
                            vm.values[targetField.field] = val;
                        });
                    }

                    function clearDownstream(index) {
                        vm.selected['Order Start Status'] = undefined;
                        filterToolsService.tools = [];
                        var fields = vm.fields;
                        for (var fieldIndex = index + 1; fieldIndex < fields.length; fieldIndex++) {
                            vm.selected[fields[fieldIndex].field] = [];
                            vm.values[fields[fieldIndex].field] = [];
                        }
                        vm.updateCheckBoxes = !vm.updateCheckBoxes;
                    }

                    //If label is specified as a function, use the function.  Otherwise, return array item.
                    vm.getFieldLabel = function (field, value) {
                        if (field.label instanceof Function) {
                            return field.label(value);
                        } else {
                            return value;
                        }
                    }

                    //If label is specified as a function, use the function.  Otherwise, return array item.
                    vm.getFieldValue = function (field, value) {
                        if (field.valueAs instanceof Function) {
                            return field.valueAs(value);
                        } else {
                            return value;
                        }
                    }

                    function queryInContext() {
                        //Get selection with respect to allowable field selections.  This is to prevent erroneous selections
                        //from other modules entering into the current server call.

                        var outputQuery = {};
                        for (var iField = 0; iField < vm.fields.length; iField++) {
                            var current = vm.fields[iField].field;
                            //Check to see if selection is populated for current field, or if a default has been identified
                            if (vm.selected[current] && vm.selected[current].length) {
                                outputQuery[current] = vm.selected[current]
                            } else if (vm.fields[iField].defaultSelect) {
                                outputQuery[current] = vm.fields[iField].defaultSelect;
                            }
                        }
                        return outputQuery;

                    }

                    function clearObject(obj) {
                        for (var member in obj) delete obj[member];
                        return obj;
                    }

                    function getPieData() {
                        var selection = queryInContext();
                        if (selection) {
                            DataService.health(selection)
                            .then(function (res) {
                                //console.log('pie data', res.data)
                                    filterToolsService.pieData = res.data;
                                    vm.pieData = filterToolsService.pieData;

                            }, function (err) {
                                console.log('error', err);
                            })

                        }
                    }

                  
                }],
                controllerAs: 'fvm'
            }
        }]);


})();