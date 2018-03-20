(function () {
    angular.module('OpenSOW')

    .factory('OpenSOWDataService', ['$resource', '$http', 'ObservableVariable', function ($resource, $http, ObservableVariable) {
        var tools = [];
        var hours = [];
        var more = false;

        var ids = new ObservableVariable();

        var fromPost = function(data, next){
            return $http.post(server + '/api/opensow' + (next ? '?skip=' + next : ''), data);
        }

        var getHours = function (data) {
            return $http.post(server + '/api/opensow?totals=true', data);
        }

        var getDetail = function (tool, program) {
            return $http.get(server + '/api/opensow/detail', { params: { tool: tool, program: program || '' } });
        }

        var getDetailExist = function (tool) {
            return $http.get(server + '/api/opensow/detail/exists', { params: { tool: tool } });
        }

        var getLastUpdated = function (table) {
            return $http.get(server + '/api/lastupdated/' + table);
        }
        
        return {
            tools: tools,
            hours: hours,
            ids: ids,
            more: more,
            fromPost: fromPost,
            getHours: getHours,
            getDetail: getDetail,
            getDetailExist: getDetailExist,
            getLastUpdated: getLastUpdated
        };
    }]);
})();