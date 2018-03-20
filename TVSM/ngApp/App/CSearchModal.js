(function () {
    angular.module('myApp')
        .controller('searchModalCtrl', ['$scope', 'SearchService',
            function ($scope, SearchService) {
                var vm = this;

                vm.svc = SearchService;

                vm.setSearch = function () {
                    SearchService.set(vm.search)
                }

                vm.submitSearch = function () {
                    SearchService.submit()
                }

            }
        ]);
})();