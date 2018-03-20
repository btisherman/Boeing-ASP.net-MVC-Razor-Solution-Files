(function () {
    'use strict';

    angular.module('miscExportPDFss', [])
    .directive('exportPdf', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    exportPdf: '=',
                    busy: '=',
                    options: '<'
                },
                link: function (scope, el, attrs) {

                    scope.remote = scope.exportPdf || {};
                    scope.remote.export = function () {
                        console.log('creating pdf', el);
                        createAndExportPDF();
                    }
                    scope.busy = scope.busy || false;

                    function createAndExportPDF() {
                        //el.css('transform', 'scale(2,2)');
                        //var source = copy .get(0) //.outerHTML;
                        //console.log('source', source);
                        scope.busy = true;
                        console.log('el', el);
                        var position = el.css('position');

                        el.css('position', 'static');
                        el.css('height', 'auto');
                        el.css('width', '11in');

                        html2canvas(el, {
                            logging: false,
                            onclone: function (document) {
                                var pdfArea = angular.element(document);
                                var omitted = pdfArea[0].getElementsByClassName('hidepdf')
                                angular.element(omitted).hide()
                                if (scope.options) {
                                    performOptions(scope.options, pdfArea)
                                }

                            },
                            onrendered: function (canvas) {
                                var imgData = canvas.toDataURL(
                                    'image/png');
                                //window.open(imgData); //test generated image by displaying in new window
                                processImage(imgData, 720, 750);
                            }
                        });

                        el.css('position', position);
                        el.css('width', '');
                        el.css('height', '');

                        function makePic(data) {
                            var image = new Image();
                            image.addEventListener('load', function () {
                                el.append(image);
                            });
                            image.src = data;

                        }
                        function performOptions(options, clone) {
                            for (var option = 0; option < options.length; option++) {
                                var obj = options[option]; //select, operation, value
                                var element = clone.find(obj.select);
                                switch (obj.operation) {
                                    case 'limit':
                                        for (var selectedElement = 0; selectedElement < element.length; selectedElement++) {
                                            var wrapped = angular.element(element[selectedElement])
                                            wrapped.text(wrapped.text().substring(0, obj.value));
                                        }
                                        break
                                    case 'noRotate':
                                        //element.css('transform', '');
                                        //element.css('width', 100)
                                        break
                                    default:

                                }
                            }
                        }

                        function processImage(imageData, height, widthInPdf) {

                            var image = new Image();
                            image.addEventListener('load', function () {
                                splitImage(image, height, widthInPdf)
                            });
                            image.src = imageData;
                        }

                        function splitImage(image, height, widthInPdf) {
                            var pieces = []

                            var imgHeight = image.height;
                            var imgWidth = image.width;
                            var width = imgWidth;

                            var rowSegments = Math.ceil(imgHeight / height);
                            for (var y = 0; y < rowSegments; y++) {
                                var canvas = document.createElement('canvas');
                                if (y === rowSegments - 1) {
                                    var newHeight = imgHeight - (y * height);
                                }
                                canvas.width = imgWidth;
                                canvas.height = height;
                                var context = canvas.getContext('2d');
                                context.drawImage(image, 0 * width, y * height, width, newHeight || height, 0, 0, canvas.width, newHeight || height);
                                pieces.push({
                                    image: canvas.toDataURL(),
                                    width: widthInPdf
                                });
                            }
                            createPdfFromPictures(pieces);
                        }

                        function createPdfFromPictures(pictures) {
                            var docDefinition = {
                                footer: function (currentPage, pageCount) { return { text: 'Page ' + currentPage.toString() + ' of ' + pageCount, margin: 5, alignment: 'right' }; },
                                //header: function (currentPage, pageCount) {
                                //    return { text: "Here", link: "http://www.google.com", decoration: "underline", margin: 15 };
                                //},
                                pageSize: 'letter',
                                pageOrientation: 'landscape',
                                pageMargins: 20,
                                content: pictures
                            }
                            pdfMake.createPdf(docDefinition).download()
                            scope.$apply(function () {
                                scope.busy = false;
                            })
                        }
                    }

                },
                controllerAs: 'vm'
            }
        }]);


})();