(function () {
    'use strict';

    angular.module('myApp')
    .directive('tvsmButtonNav', [
        function () {
            return {
                restrict: 'AE',
                templateUrl: server + '/ngApp/App/partials/button-nav-partial.html',
                scope: {
                    text: '@',
                    route: '@',
                    disabled: '@',
                    ext: '@'
                },
                controllerAs: 'vm',
                controller: ['$location', '$scope', '$window', function ($location, $scope, $window) {
                    var vm = this;

                    vm.navigate = function () {
                        if (!$scope.disabled) {
                            if ($scope.ext) {
                                $window.open($scope.route)
                            } else {
                                $location.path($scope.route)
                            }
                        }
                    }

                    $scope.$watch(function () { return $location.path() }, function (newVal) {
                        if (newVal === $scope.route) {
                            $scope.activeRoute = true;
                        } else {
                            $scope.activeRoute = false;
                        }
                    })
                }]
            }
        }]);


})();