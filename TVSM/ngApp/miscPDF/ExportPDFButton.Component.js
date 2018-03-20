(function () {
    'use strict';

    angular.module('miscExportPDF')
     .component('exportPdfButton', {
         bindings: {
             click: '&',
             busy: '='
         },
         template: '<button class="btn btn-info btn-sm hidepdf" ng-click="pdfvm.click()"><span style="font-weight: bold">PDF</span><div ng-if="pdfvm.busy" style="display:inline-block;margin-left: 10px" class="busy-spinner"><div class="spinner-icon" style="border-top-color:white;border-left-color: white"></div></div></button>',
         controller: [
             function () {
                 var vm = this;
             }],
         controllerAs: 'pdfvm'
     });
})();