(function () {
    'use strict';

    angular.module('miscExportPDF')
    .directive('exportData', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    exportData: '=',
                    busy: '=',
                    options: '<'
                },
                link: function (scope, el, attrs) {

                    scope.remote = scope.exportData || {};
                    scope.remote.export = function () {
                        console.log('creating pdf', el);
                        createAndExportPDF();
                    }
                    scope.busy = scope.busy || false;

                    var doc = new jsPDF('l', 'pt', 'b4');

                    function createAndExportPDF() {
                        //var doc = new jsPDF();
                        //doc.fromHTML(el[0])
                        //var specialElementHandlers = {
                        //    '.hidepdf': function(element, renderer){
                        //        return true;
                        //    }
                        //}
                        var position = el.css('position');
                        el.css('position', 'static');
                        el.css('height', 'auto');
                        el.css('width', '1000px');
                        var startingPos = el.offset();

                        var clone = el.not('.hidepdf') //.clone(true);
                        var source = clone[0];

                        //doc.textWithLink('Testing 123', 60, 300, { url: 'http://localhost:62768/#/opensow/17PME140A0403' });

                        var walk_the_DOM = function walk(node, func) {
                            func(node);
                            node = node.firstChild;
                            while (node) {
                                walk(node, func);
                                node = node.nextSibling;
                            }
                        };

                        walk_the_DOM(source, function (node) {
                            if (node.nodeType == 3 && node.nodeValue.trim())
                                handleText(node, startingPos);
                            if (node.nodeName == 'DIV')
                                handleDiv(node, startingPos);
                            if (node.nodeName == 'IMG')
                                handleImg(node, startingPos);
                        });

                        var margin = {
                            top: 15,
                            right: 15,
                            bottom: 15,
                            left: 15
                        }

                        //scope.doc.fromHTML(
                        //'', // HTML string or DOM elem ref.
                        //margin.left, // x coord
                        //margin.top, // y coord
                        //{
                        //    'elementHandlers': {}//specialElementHandlers
                        //},
                        //function (dispose) {
                        //    // dispose: object with X, Y of the last line add to the PDF 
                        //    //          this allow the insertion of new lines after html
                        //    scope.doc.save('Test.pdf');
                        //},margin);

                        el.css('position', position);
                        el.css('height', '');
                        el.css('width', '');

                        doc.save('Test.pdf')
                    }

                    function handleText(node, startingPos){
                        var wrapped = angular.element(node.parentNode);
                        if (!wrapped.hasClass('hidepdf')) {
                            var position = wrapped.offset();
                            var x = position.left - startingPos.left;
                            var y = position.top - startingPos.top;
                            var color = parseColor(wrapped.css('color'));
                            var size = parseInt(wrapped.css('font-size'), 10);
                            var bottom = parseFloat(wrapped.css('bottom'), 10);
                            if (bottom) {
                                y -= bottom;
                            }
                            console.log({ 'wrapped': wrapped, node: node, position: position, color: color, size: size, computed: window.getComputedStyle(wrapped[0], null) }, bottom);

                            doc.setFontSize(size);
                            doc.setTextColor(color.red, color.green, color.blue);
                            doc.text(x, y, wrapped.text(),'','','center')
                        }
                    }

                    function handleDiv(node, startingPos) {
                        var wrapped = angular.element(node);
                        var bgColor = wrapped.css('background-color');
                        if (bgColor && bgColor !== 'transparent') {
                            var position = wrapped.offset();
                            var x = position.left - startingPos.left;
                            var y = position.top - startingPos.top;
                            var color = parseColor(wrapped.css('background-color'));
                            var size = { height: wrapped.innerHeight(), width: wrapped.innerWidth() }
                            //console.log({ 'wrapped': wrapped, node: node, position: position, color: color, size: size });
                        //doc.setDrawColor(colo);
                            doc.setFillColor(color.red, color.green, color.blue);
                            doc.rect(x, y, size.width, size.height, 'F');
                        }
                    }

                    function handleImg(node, startingPos) {
                        var wrapped = angular.element(node);
                        var position = wrapped.position();
                        var x = position.left - startingPos.left;
                        var y = position.top - startingPos.top;
                        var size = { height: node.height, width: node.width }
                        var canvas = document.createElement('canvas');
                        canvas.width = size.width;
                        canvas.height = size.height;
                        var context = canvas.getContext('2d');
                        context.drawImage(node, 0,0, canvas.width, canvas.height);
                        var data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
                        console.log({ 'wrapped': wrapped, node: node, position: position, size: size, url: data });
                        // Convert the data to binary form
                        data = atob(data)

                        doc.addImage(data, 'JPEG', x, y, size.width, size.height);
                    }

                    function parseColor(input) {
                        var color = {}
                        color.string = input;
                        if (color.string) {
                            var parsed = color.string.split("(")[1].split(")")[0].split(",");
                            color.red = parseInt(parsed[0], 10);
                            color.green = parseInt(parsed[1], 10);
                            color.blue = parseInt(parsed[2], 10);
                        }
                        return color;
                    }

                },
                controllerAs: 'vm'
            }
        }]);


})();