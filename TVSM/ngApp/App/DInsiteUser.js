(function () {
    'use strict';

    angular.module('myApp')
    .directive('tvsmInsiteUser', ['$http', function ($http) {
        return {
            restrict: 'AE',
            template: '<span class="insite-hovercard" data-bemsid="{{bems}}">{{name}}</span>',
            scope: {
                bems: '=',
                name: '='
            },
            link: function (scope, element, attr) {
                scope.$watch('bems', refresh);
                function refresh() {
                    scope.name = scope.bems;
                    $http.jsonp('https://insite.web.boeing.com/culture/service/publicUserProfileWebService/json?bemsid=' + scope.bems + '&callback=JSON_CALLBACK')
                    .then(function (res) {
                        var user = res.data.profile.user;
                        scope.name = user.firstName + ' ' + user.lastName;
                        var hovercard = new INSITE.Hovercard();
                        hovercard.refresh();
                    })
                }
            }
            }
    }]);


})();