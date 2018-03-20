(function () {
    angular.module('myApp',
        [
            'angular-loading-bar', //External
            'ngResource',
            'ngRoute',
            'ngAnimate',
            'ngSanitize',
            'ui.bootstrap', //External
            //TVSM Modules
            'WIP',
            'Gantt',
            'LoadProfile',
            'OpenSOW',
            'BCADashboard',
            'RentonDashboard',
            'RentonWIP',
            'GlobalMetrics',
            //Helpers -- Boeing
            'miscAlerts',
            'filterTools',
            'miscSearch',         
            'isteven-multi-select',
            'rcGauge'

        ]
    )
})();