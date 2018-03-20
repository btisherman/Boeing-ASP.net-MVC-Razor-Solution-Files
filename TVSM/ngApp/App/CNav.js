(function () {
    angular.module('myApp')
        .controller('navCtrl', ['$scope', 'SearchService', '$location',
            function ($scope, SearchService, $location) {
                var vm = this;

                vm.svc = SearchService;

                vm.submitSearch = function () {
                    SearchService.submit()
                }

            }
        ]);
})();