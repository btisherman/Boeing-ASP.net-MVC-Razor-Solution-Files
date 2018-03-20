(function () {
    'use strict';

    angular.module('RentonWIP')
    .directive('tvsmRentonWipDetail', ['filterToolsService', 'SearchService', 'WipDataService', 
        function (filterToolsService, SearchService, WipDataService) {
            return {
                restrict: 'AE',
                templateUrl: server + '/ngApp/RentonWIP/partials/rentonwipdetail-partial.html',
                scope: {
                    id: '@',
                    mode: '@'
                },
                controller: ['$scope', '$location', function ($scope, $location) {
                    var vm = this;
                    vm.filterService = filterToolsService;
                    vm.searchService = SearchService;
                    vm.id = $scope.id;
                    vm.mode = $scope.mode;

                    vm.detailPDFRemote = {};
                    vm.exportPDF = function () {
                        console.log('exporting pdf')
                        vm.detailPDFRemote.export();
                    }

                    vm.pdfOptions = {
                        header: '.brand-header',
                        footer: '.brand-footer',
                        cloneOperations: [
                        { select: '.wip-sow', operation: 'limit', value: 300 },
                        { select: '.wip-etvs-notes', operation: 'limit', value: 200 },
                        { select: 'a.btn', operation: 'replace-text', value: '.' }
                    ]
                }

                    var statuses = [
                        'Loading details, please wait.',
                        'Order not found, please try again.'
                    ]
                    vm.status = statuses[0];
                    getOrder($scope.id);

                    vm.getAging = function (date, comp) {
                        var dateTo = comp ? new Date(comp) : new Date();
                        if (date) {
                            var multiplier = (1000 * 60 * 60 * 24); //Days in milliseconds
                            var timeBetween = dateTo.getTime() - (new Date(date)).getTime();
                            return Math.round(timeBetween / multiplier);

                        } else {
                            return '-'
                        }
                    }

                    vm.getOpStyle = function (op) {
                        if (op.STATUS === 'X' || op.STATUS === 'C') {
                            return 'wip-inactive-operation';
                        }
                        if (vm.details && parseInt(op['OperNo']) == vm.details['Active Op #']) {
                            return 'wip-active-operation';
                        }
                        return;
                    }

                    vm.close = function () {
                        $location.hash(vm.id)
                        $location.path('/wip/');
                    }

                    vm.datePast = function(date){
                        if (date) {
                            var result = new Date(date).getTime() - Date.now() <= 0 ? true : false;
                            return result;
                        } else {
                            return null;
                        }
                    }
                    function getOrder(id) {
                        WipDataService.details(id).then(function (res) {
                            vm.details = res.data;

                            //Get additional details
                            getRelatedFromID('arlog', $scope.id);
                            getRelatedFromID('mesorders', $scope.id);
                            getRelatedFromID('ops', $scope.id);
                            getRelatedFromID('sats', $scope.id);
                            getRelatedFromID('ncrs', $scope.id);
                        }, function (err) {
                            console.log('err', err);
                            if (err.status === 404) {
                                vm.status = statuses[1]; //Not found
                            }
                        })
                    }

                    function getRelatedFromID(related, id) {
                        WipDataService.related(related, id).then(function (res) {
                            vm[related] = res.data;
                        }, function (err) {
                            console.log('err retrieving ' + related, err);
                        })
                    }

                }],
                controllerAs: 'vm'
            }
        }]);


})();