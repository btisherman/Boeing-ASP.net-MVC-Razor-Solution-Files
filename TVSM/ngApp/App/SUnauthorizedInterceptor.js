(function () {
    angular.module('myApp')

        .factory('ajaxInterceptor', ['$q', '$window', '$location', 'alertService', '$rootScope', function ($q, $window, $location, alertService, $rootScope) {
            var loadingCount = 0;

            return {
                request: function (config) {
                    if (++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                    return config || $q.when(config);
                },

                response: function (response) {
                    if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    if (response.status === 403) {
                        var requestType;
                        switch (response.config.method) {
                            case 'GET':
                                requestType = "read";
                                break;
                            case 'POST':
                                requestType = "create";
                                break;
                            case 'PUT':
                                requestType = "modify";
                                break;
                            case 'DELETE':
                                requestType = "delete";
                                break;
                            default:
                                requestType = "manipulate"
                        }
                        var message = 'You are not authorized to ' + requestType + ' the data requested.  Please contact the group administrator if you require elevated permissions.'
                            alertService.addIf('danger', message);
                    } else if (response.status !== 404 && response.status !== -1) {
                        var message = 'The application has encountered an error.  Please refresh the page, and contact us if the problem persists.'
                        alertService.addIf('danger', message);
                        console.log('xhr error', response);
                    }
                    if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');  
                    
                    return $q.reject(response);
                }
            };
    }]);
})();