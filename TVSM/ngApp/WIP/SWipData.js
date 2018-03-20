(function () {
    angular.module('WIP')

    .factory('WipDataService', ['$resource', '$http', function ($resource, $http) {
        var tools = [];
        var more = false;
        var ids;

        var fromPost = function(data, next){
            return $http.post(server + '/api/wip' + (next ? '?skip=' + next : ''), data);
        }

        var details = function (id) {
            return $http.get(server + '/api/wip/' + id);
        }

        var detailsExist = function (id) {
            return $http.get(server + '/api/wip/exists', { params: { id: id } });
        }

        var arlog = function (id) {
            return $http.get(server + '/api/arlog/' + id);
        }

        var mesorders = function (id) {
            return $http.get(server + '/api/mesorders/' + id);
        }

        var operations = function (id) {
            return $http.get(server + '/api/orderops/' + id);
        }

        var sats = function (id) {
            return $http.get(server + '/api/ordersats/' + id);
        }

        var related = function (related, id) {
            var path;
            switch (related) {
                case 'arlog':
                    path = '/api/arlog/';
                    break;
                case 'mesorders':
                    path = '/api/mesorders/';
                    break;
                case 'ops':
                    path = '/api/orderops/';
                    break;
                case 'sats':
                    path = '/api/ordersats/';
                    break;
                case 'ncrs':
                    path = '/api/orderncrs/';
                    break;
                default:
                    return;
            }

            return $http.get(server + path + id);
        }
        
        return {
            tools: tools,
            more: more,
            ids: ids,
            fromPost: fromPost,
            details: details,
            detailsExist: detailsExist,
            arlog: arlog,
            mesorders: mesorders,
            operations: operations,
            sats: sats,
            related: related
        };
    }]);
})();