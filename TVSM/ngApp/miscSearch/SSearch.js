(function () {
    angular.module('miscSearch')

    .service('SearchService', ['SearchHandler', function (SearchHandler) {
        var model = this;
        model.value = "";
        model.set = function (newSearch) {
            model.value = newSearch;
        }
        model.submit = function () {
            model.busy = true;
            SearchHandler.submitSearch(model.value, finish);
        }

        function finish() {
            model.busy = false;
        }

    }]);
})();