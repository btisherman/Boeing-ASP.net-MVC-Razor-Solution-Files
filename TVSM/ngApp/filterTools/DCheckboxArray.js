(function () {
    'use strict';

    angular.module('filterTools')
    .directive('tvsmCheckboxArray', [
        function () {
            return {
                restrict: 'AE',
                template: '<div class="checkbox-filter-item" ng-class="{withsubtext:subtext[value]}" ng-repeat="value in values"><input class="with-font" id="checkbox-{{value}}" ng-change="vm.updateOutgoing()" ng-model="vm.selected[value]" type="checkbox"/><label for="checkbox-{{value}}"><span class="filter-checkbox-label">{{value}}<span class="subtext">{{subtext[value] ? subtext[value] : ""}}</span></span></label></div>',
                scope: {
                    select: '=',
                    values: '=',
                    updated: '&',
                    watch: '=',
                    subtext: '='
                },
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    var vm = this;
                    vm.updateIncoming = function () {
                        var selectionObj = {};
                        var sel = $scope.select || [];
                        var val = $scope.values || [];
                        for (var iVal = 0; iVal < val.length; iVal++) {
                            var isTrue = sel.indexOf(val[iVal]) >= 0 ? true : false;
                            selectionObj[val[iVal]] = isTrue;
                        }
                        vm.selected = selectionObj;
                    }                    
                    vm.updateIncoming();

                    vm.updateOutgoing = function () {
                        var trueValues = [];
                        angular.forEach(vm.selected, function (value, key) {
                            if (value === true) {
                                trueValues.push(key);
                            }
                        });
                        $scope.select = trueValues;
                        $scope.updated();

                    }

                    $scope.$watch('watch', function (newVal) {
                        vm.updateIncoming();
                    })
                    
                }],
                controllerAs: 'vm'
            }
        }]);


})();