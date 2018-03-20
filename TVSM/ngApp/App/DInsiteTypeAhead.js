(function () {
    'use strict';

    angular.module('myApp')
    .directive('tvsmInsiteTypeAhead', ['$http', function ($http) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
            },
            link: function (scope, element, attr, ngModel) {
                $http.jsonp('https://insite.web.boeing.com/culture/service/publicUserProfileWebService/json?bemsid=' + scope.bems + '&callback=JSON_CALLBACK')
                .then(function (res) {
                    console.log('res', res);
                    var user = res.data.profile.user;
                    scope.name = user.firstName + ' ' + user.lastName;
                    var hovercard = new INSITE.Hovercard();
                    hovercard.refresh();
                })
            }
        }
    }]);


})();