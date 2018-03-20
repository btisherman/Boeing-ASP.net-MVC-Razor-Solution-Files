(function () {
    angular.module('BCADashboard')

    .factory('BCADashboardDataService', ['$resource', '$http', function ($resource, $http) {

        var mes = function (data) {
            return $http.post(server + '/api/schedulehealth', data);
        }

        var held = function (data) {
            return $http.post(server + '/api/bcadashboard/heldhealth', data);
        }

        var ar = function (data) {
            return $http.post(server + '/api/bcadashboard/arhealth', data);
        }

        var ncr = function (data) {
            return $http.post(server + '/api/bcadashboard/ncrhealth', data);
        }
        //var hours = [];
        //var more = false;

        //var fromPost = function(data, next){
        //    return $http.post(server + '/api/opensow' + (next ? '?skip=' + next : ''), data);
        //}

        //var getHours = function (data) {
        //    return $http.post(server + '/api/opensow?totals=true', data);
        //}

        //var getDetail = function (tool, program) {
        //    return $http.get(server + '/api/opensow/detail', { params: { tool: tool, program: program || '' } });
        //}

        //var getDetailExist = function (tool) {
        //    return $http.get(server + '/api/opensow/detail/exists', { params: { tool: tool } });
        //}

        //var getLastUpdated = function (table) {
        //    return $http.get(server + '/api/lastupdated/' + table);
        //}
        
        return {
            mes: mes,
            held: held,
            ar: ar,
            ncr: ncr
        };
    }]);
})();