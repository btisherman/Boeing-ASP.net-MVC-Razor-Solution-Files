(function () {

    'use strict';

    angular.module('miscAlerts')

    .factory('alertService', function () {
        var alertService = {};

        // create an array of alerts
        alertService.alerts = [];

        alertService.add = function (type, msg) {
            alertService.alerts.push({ 'type': type, 'msg': msg, count: 1 });
        };

        alertService.addIf = function (type, msg) {
            var match = alertService.alerts.filter(function (d) { return d.msg === msg });
            if (match.length) {
                match[0].count++
            } else {
                alertService.alerts.push({ 'type': type, 'msg': msg, count: 1 });
            }

        };

        alertService.closeAlert = function (index) {
            alertService.alerts.splice(index, 1);
        };

        alertService.exists = function (message) {
            var match = alertService.alerts.filter(function (d) { return d.msg === message });
            return match.length ? true : false;
        }

        return alertService;
    });

})();