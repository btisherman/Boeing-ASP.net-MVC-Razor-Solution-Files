(function () {
    'use strict';

    angular.module('miscAlerts')
    .directive('tvsmAlertDisplay', ['alertService', function (alertService) {
        return {
            restrict: 'AE',
            template: '<div ng-repeat="alert in vm.alerts" class="alert alert-{{alert.type}}" role="alert"><button ng-click="vm.closeAlert($index)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>{{alert.msg}}<span ng-show="alert.count > 1" class="badge alert-{{alert.type}}">{{alert.count}}</span></div>',
            controller: function(){
                var vm = this;
                vm.alertService = alertService;

                vm.alerts = vm.alertService.alerts;

                vm.closeAlert = function (index) {
                    vm.alertService.closeAlert(index);
                }
            },
            controllerAs: 'vm'
            }
    }]);


})();