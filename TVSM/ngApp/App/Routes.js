(function () {
    angular.module('myApp')

    .config(['$routeProvider', '$httpProvider',
      function ($routeProvider, $httpProvider) {
          $httpProvider.interceptors.push('ajaxInterceptor');

          $routeProvider.
            when('/', {
                templateUrl: server + '/ngApp/App/partials/home-partial.html',
                controller: 'mainCtrl',
                controllerAs: 'vm'
            }).
              when('/wip', {
                  template: '<tvsm-wip-list></tvsm-wip-list>'
              }).
              when('/rentonwip', {
                  template: '<tvsm-renton-wip-list></tvsm-renton-wip-list>'
              }).

              when('/wip/gantt', {
                  template: '<tvsm-wip-list gantt="true"></tvsm-wip-list>'
              }).
              when('/wip/:id/:mode?', {
                  template: function (params) { return '<tvsm-wip-detail id="' + params.id + '" mode="' + (params.mode || '')  + '"></tvsm-wip-detail>' }
              }).
              when('/loadprofile', {
                  template: '<tvsm-load-profile><tvsm-load-profile>'
              }).
              when('/opensow/:id', {
                  template: function (params) { return '<tvsm-open-sow-detail id="' + params.id + '"></tvsm-open-sow-detail>' }
              }).
              when('/opensow', {
                  template: '<tvsm-open-sow></tvsm-open-sow>'
              }).
              when('/bcadash', {
                  template: '<tvsm-bca-dashboard></tvsm-bca-dashboard>'
              }).
              when('/renton', {
                  template: '<tvsm-renton-dashboard></tvsm-renton-dashboard>',
                  reloadOnSearch: false
              }).
               when('/globalmetrics', {
                   template: '<tvsm-global-metrics></tvsm-global-metrics>'
               }).
            otherwise({
                redirectTo: '/'
            });
      }]);
})();