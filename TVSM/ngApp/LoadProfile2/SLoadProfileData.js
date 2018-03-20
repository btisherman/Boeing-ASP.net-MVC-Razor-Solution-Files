(function () {
    angular.module('LoadProfile2')

    .factory('LoadProfileDataService2', ['$http', function ($http) {
        var tools = function (interval, data) {
            return $http.post(server + '/webapi/loadprofiler/' + interval, data)
        }
        
        var categories = [
            { name: 'Committed', color: '#1f77b4' },
            { name: 'Improvement', color: '#ff7f0e' },
            { name: 'Maintenance', color: '#2ca02c' },
            { name: 'Routine', color: '#d62728' },
            { name: 'Safety', color: '#9467bd' },
            { name: 'Sustaining', color: '#8c564b' },
            { name: 'Prod Assist', color: '#e377c2' },
        ]

        return {
            tools: tools,
            categories: categories
        };
    }]);
})();