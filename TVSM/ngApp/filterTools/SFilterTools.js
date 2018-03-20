(function () {

    'use strict';

    angular.module('myApp')

    .factory('filterToolsService', function () {
        var filterTools = {};
        filterTools.displayFilter = true;
        filterTools.selected = {};
        filterTools.values = {};
        filterTools.tools = [];
        filterTools.template = {};
        filterTools.pieData = [];

        return filterTools;
    });

})();