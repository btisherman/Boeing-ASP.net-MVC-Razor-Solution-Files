(function () {
    angular.module('miscSearch')

    .service('SearchHandler', ['$q', 'WipDataService', 'OpenSOWDataService', 'alertService', '$location',
        function ($q, WipDataService, OpenSOWDataService, alertService, $location) {
        var model = this;
        
        model.submitSearch = function (search, callback) {
            var orders = WipDataService.detailsExist(search);
            var tools = OpenSOWDataService.getDetailExist(search);

            $q.all([orders, tools]).then(function (data) {
                if (data[0].data.length === 1) {
                    $location.path('/wip/' + data[0].data[0]);
                } else if (data[0].data.length > 1) {
                    WipDataService.ids = data[0].data;
                    $location.path('/wip');
                }
                else if (data[1].data.length === 1) {
                    $location.path('/opensow/' + data[1].data[0]);
                } else if (data[1].data.length > 1) {
                    OpenSOWDataService.ids.set(data[1].data);
                    $location.path('/opensow');
                }
                //else if (data[1].data) {
                //    $location.path('/opensow/' + search);
                //}
                else {
                    alertService.addIf('danger', 'No items meet your search criteria.')
                }
            }).finally(function(){ callback() })


        }

    }]);
})();