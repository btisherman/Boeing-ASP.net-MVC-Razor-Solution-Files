(function () {
    angular.module('RentonDashboard')

    .factory('RentonDashboardDataService', ['$resource', '$http', function ($resource, $http) {

        var mes = function (area) {
            return $http.get(server + '/api/bcadashboard/rtnschedulehealth/' + area);
        }

        var held = function (area) {
            return $http.get(server + '/api/bcadashboard/rtnheldhealth/' + area);
        }

        var heldsummary = function (area) {
            return $http.get(server + '/api/bcadashboard/rtnheldhealthsummary/' + area);
        }

        var heldsummaryorders = function (area, health) {
            return $http.get(server + '/api/bcadashboard/rtnheldhealthsummaryorders/' + area + '/' + health);
        }

        var heldorders = function (area, responsible, health) {
            return $http.get(server + '/api/bcadashboard/rtnheldhealth/' + area + '/' + responsible + '/' + health);
        }

        var ar = function (area) {
            return $http.get(server + '/api/bcadashboard/rtnarhealth/' + area);
        }

        var arFromHealth = function (area, health) {
            return $http.get(server + '/api/bcadashboard/rtnarhealth/' + area + '/' + health);
        }

        var tips = function (area) {
            return $http.get(server + '/api/bcadashboard/rtntipshealth/' + area);
        }

        var tipsFromHealth = function (area, health) {
            return $http.get(server + '/api/bcadashboard/rtntipshealth/' + area + '/' + health);
        }

        var orders = function (area, health) {
            return $http.get(server + '/api/bcadashboard/rtnordersfromhealth/' + area + '/' + health);
        }

        var nco = function (area) {
            return $http.get(server + '/api/bcadashboard/rtnncohealth/' + area);
        }

        var ncoFromHealth = function (area, health) {
            return $http.get(server + '/api/bcadashboard/rtnncohealth/' + area + '/' + health);
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
            heldsummary: heldsummary,
            heldsummaryorders: heldsummaryorders,
            heldorders: heldorders,
            ar: ar,
            arFromHealth: arFromHealth,
            tips: tips,
            tipsFromHealth: tipsFromHealth,
            orders: orders,
            nco: nco,
            ncoFromHealth: ncoFromHealth
        };
    }]);
})();