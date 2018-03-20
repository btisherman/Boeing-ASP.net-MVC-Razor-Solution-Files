(function () {
    angular.module('myApp')

    .factory('insiteTypeaheadService', ['$http', function ($http) {
        var getNames = function (val) {
            return $http.jsonp('https://insite.web.boeing.com/culture/service/boeingUserWebServiceJSON/name?query=' + val + '&callback=JSON_CALLBACK')
        .then(function (res) {
            if (res.data.resultholder.totalResults !== '0') {
                var profile = res.data.resultholder.profiles.profileholder
                if (Array.isArray(profile)) {
                    return res.data.resultholder.profiles.profileholder.map(function (obj) {
                        var newobj = {};
                        newobj.name = obj.user.firstName + ' ' + obj.user.lastName;
                        newobj.id = obj.user.bemsId;
                        return newobj;
                    });
                } else {
                    return [
                        {
                            name: profile.user.firstName + ' ' + profile.user.lastName,
                            id: profile.user.bemsId
                        }
                    ]
                }
            }
            else {
                return [];
            }
        });
        }
        return {
            getNames: getNames,
        };
    }]);
})();