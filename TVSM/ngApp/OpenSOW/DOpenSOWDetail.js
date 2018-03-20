(function () {
    'use strict';

    angular.module('OpenSOW')
    .component('tvsmOpenSowDetail', {
        bindings: {
            id: '@'
        },
        templateUrl: server + '/ngApp/OpenSOW/partials/opensowdetail-partial.html',
        controller: ['OpenSOWDataService', 'alertService', '$scope', '$location', '$timeout', '$rootScope', '$window',
            function (OpenSOWDataService, alertService, $scope, $location, $timeout, $rootScope, $window) {
                var vm = this;

                vm.$onInit = function () {
                    $rootScope.$broadcast('modal-opened');
                    if (vm.id && vm.id !== 'multi') {
                        vm.getDetails({ Tool: vm.id })
                    } else if (vm.dataService.toolsToPrint) {
                        var tools = vm.dataService.toolsToPrint;
                        vm.multi = true;
                        debugger
                        vm.pdfOptions.header = false;
                        for (var iPrint = 0; iPrint < tools.length; iPrint++) {
                            var tool = tools[iPrint];
                            vm.getDetails({Tool: tool.Tool})
                        }
                    } else {
                        $location.path('/opensow');
                    }
                };

                vm.dataService = OpenSOWDataService;
                vm.server = server;

                vm.tools = [];
                vm.detailPDFRemote = {};
                vm.exportPDF = function () {
                    console.log('exporting pdf')
                    $timeout(function () {
                        vm.detailPDFRemote.export();
                    }, 0)
                }

                vm.pdfOptions = {
                    header: '.brand-header',
                    footer: '.brand-footer'
                }


                OpenSOWDataService.getLastUpdated('tblTVSM').then(function (res) { vm.tvsmLastUpdate = res.data[0] });

                vm.getDetails = function (tool, type) {
                    OpenSOWDataService.getDetail(tool.Tool, tool.Program).then(function (res) {
                        tool = res.data;

                        var caption, suffix;
                        var details = type ? tool[type] : undefined;
                        if (details) {
                            suffix = details.length === 1 ? '' : 's';
                        } else {
                            suffix = 's';
                        }


                        switch (type) {
                            case "UNV":
                                caption = 'MES Order' + suffix
                                details = details.concat(tool.SFM);
                                break;
                            case "SFM":
                                caption = 'MES Order' + suffix
                                details = details.concat(tool.UNV);
                                break;
                            case "AR":
                                caption = 'Action Request' + suffix
                                break;
                            case "SAT":
                                caption = 'SAT' + suffix
                                break;
                            case "NCR":
                                caption = 'NCR' + suffix
                                break;
                            default:
                                caption = 'Open Statement of Work'
                        }
                        tool.caption = caption;
                        vm.tools.push(tool);

                    }, function (err) { console.log('error', err); });
                }

                vm.close = function () {
                    $rootScope.$broadcast('modal-closed');
                    $location.path('/opensow/');

                }

                vm.getWIPdetails = function (id) {
                    $window.open(server + '/#/wip/' + id + '/full', '_blank')
                }

                vm.getScheduleClass = function (value) {
                    var date = new Date(value);
                    if (!isNaN(date.getDate())) {
                        var compDateEndOfDay = new Date(date.setHours(24));
                        var behind = compDateEndOfDay.getTime() < new Date().getTime();
                        if (behind && value) {
                            return 'opensow-background-alert';
                        } else {
                            return;
                        }
                    } else {
                        return 'opensow-mesqueue';
                    }
                }

                vm.getDetailHours = function (tool, doc) {
                        var documents = tool[doc];
                        var total = 0, val;
                        if (doc === 'MES') {
                            documents = tool.UNV.concat(tool.SFM);
                            for (var i = 0; i < documents.length; i++) {
                                if (val = documents[i].Total_Est) {
                                    total += val;
                                }
                            }
                        } else {
                            total = documents.length * 8;
                        }
                        return total;
                }

                $scope.$on('$locationChangeSuccess', function () {
                    $rootScope.$broadcast('modal-closed');
                });
            }],
        controllerAs: 'vm'
    });
})();