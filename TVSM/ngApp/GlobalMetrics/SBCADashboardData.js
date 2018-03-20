(function () {
    angular.module('GlobalMetrics')

    .factory('GlobalMetricsDataService', ['$resource', '$http', function ($resource, $http) {

        var metrics = function (data) {
            return $http.post(server + '/api/globalmetrics/metrics', data);
        }
        
        return {
            metrics: metrics
        };
    }]);
})();