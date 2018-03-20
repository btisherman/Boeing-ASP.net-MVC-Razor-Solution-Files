(function () {
    'use strict';

    angular.module('miscExportPDF')
    .directive('exportPdf', [ '$q',
        function ($q) {
            return {
                restrict: 'A',
                scope: {
                    exportPdf: '=',
                    busy: '=',
                    options: '<',
                    pdfClass: '@'
                },
                link: function (scope, el, attrs) {

                    scope.remote = scope.exportPdf || {};
                    scope.remote.export = function () {
                        console.log('creating pdf', el);
                        createAndExportPDF();
                    }
                    scope.busy = scope.busy || false;

                    var doc, docDims
                    var startingPos;
                    var lastColor;
                    var options = scope.options || {};
                    var sections = ['header', 'footer', 'body'].map(function (val) {
                        var obj = {};
                        obj.section = val,
                        obj.selector = options[val];
                        return obj;
                    });
                    var pdfClass = options.pdfClass || 'export-pdf';

                    function createAndExportPDF() {
                        scope.busy = true;

                        var getDims = function (outside) {
                            return {
                                outside: outside,
                                height: outside * .773,
                                inside: outside - 20
                            }
                        }
                        docDims = getDims(1100);

                        doc = new jsPDF('l', 'pt', [docDims.outside, docDims.height]);
                        startingPos = el.offset();

                        var ObjRenderer = html2canvas.ObjRenderer;
                        var promises = [];

                        for (var iSection = 0; iSection < sections.length; iSection++) {
                            var obj = sections[iSection];

                            var promise = getSection(obj.section);
                            promises.push(promise);
                        }

                        $q.all(promises).then(function (values) {
                            var header = values[0];
                            var footer = values[1];
                            var body = values[2];

                            var usablePageArea = docDims.height;
                            var multiplier = 2.333;
                            var headerHeight = 0;
                            var bottomMargin = 60;
                            var headerMargin = 15;


                            if (header.length) {
                                headerHeight = header.dims.height + headerMargin;

                                usablePageArea -= headerHeight;
                            }
                            if (footer.length) {
                                var footerHeight = footer.dims.height;
                                var footerPos = docDims.height - (footerHeight + 10); // * multiplier);
                                footer.offset.top -= footerPos;
                                var min = getMinSectionElement(footer);
                                //On IE the footer gets pushed down sometimes, this fixes the offset.
                                if (min > docDims.height) {
                                    footer.offset.top += footerHeight;
                                }

                                usablePageArea -= footerHeight;
                            }

                            usablePageArea -= bottomMargin;

                            body.offset.top -= headerHeight;

                            var bodyHeight = body.dims.height;
                            var numberOfPages = Math.ceil(bodyHeight / usablePageArea);
                            doc.numberOfPages = numberOfPages;
                            if (numberOfPages > 1) {
                                var pages = [];
                                for (var iPage = 0; iPage < numberOfPages; iPage++) {
                                    var pageOffset = iPage * usablePageArea;
                                    var topOffset = body.offset.top + pageOffset;
                                    if (pageOffset) {
                                        topOffset -= headerMargin;
                                    }
                                    var page = [];
                                    page.offset = {
                                        top: topOffset,
                                        left: body.offset.left
                                    }
                                    page.pageOffset = pageOffset;
                                    page.pageNumber = iPage + 1;
                                    pages.push(page);
                                }

                                var elementPromises = [];
                                for (var iElement = 0; iElement < body.length; iElement++) {
                                    var element = body[iElement];
                                    var bounds = element.value.bounds;
                                    var startingPage = Math.ceil(bounds.top / usablePageArea) || 1
                                    var endingPage = Math.ceil(bounds.bottom / usablePageArea) || 1
                                    var isTable = (element.type === 'table') ? true : false;
                                    for (var iOverlap = startingPage; iOverlap < endingPage; iOverlap++) {
                                        var overlap = bounds.bottom - (iOverlap * usablePageArea);

                                        if (isTable && overlap >= bottomMargin) {


                                            //should put table header on start of ending page
                                            var table = angular.element(element.value.container.node)
                                            var tableHeader = table.find('thead');
                                            el.append(table.parent());
                                            var targetOffset = pages[0].offset;
                                            //Push page down to accommodate header
                                            pages[iOverlap].offset.top -= tableHeader[0].scrollHeight;
                                            //Create promises
                                            var headerDeferred = $q.defer();
                                            elementPromises.push(headerDeferred.promise);

                                            (function() {
                                                var header = tableHeader;
                                                var page = iOverlap + 1;
                                                var offset = { top: -1 * (targetOffset.top), left: element.value.bounds.left - (targetOffset.left * 2) };
                                                var deferred = headerDeferred;
                                                var toRemove = table.parent();
                                                getSection(header).then(function (data) {
                                                    var min = getMinElement(pages, page)
                                                    data.offset.top -= (min - data.dims.height - 10);
                                                    data.offset.left -= offset.left;
                                                    doc.setPage(page);
                                                    render(data);
                                                    toRemove.remove();
                                                    deferred.resolve();
                                                }, function (err) {
                                                    debugger
                                                });
                                            })();
                                        }
                                    }
                                   
                                        //for (var thisPage = startingPage; thisPage <= endingPage; thisPage++) {
                                        pages[startingPage - 1].push(element);
                                        //}
                                }

                                //Eliminate extra pages that do not contain data
                                var filledPages = pages.filter(function (page) { return page.length });
                                doc.numberOfPages = filledPages.length;

                                for (var iRender = 0; iRender < filledPages.length; iRender++) {
                                    var page = filledPages[iRender];
                                    renderPage(iRender + 1, page, header, footer)
                                }

                            } else {
                                renderPage(1, body, header, footer)
                            }

                            $q.all(elementPromises).then(function () {
                                savePdf();
                            });

                        });

                        function getMinSectionElement(element) {
                            return getMinElement([element], 1);
                        }

                        function getMinElement(pages, page) {
                            var pageElement = pages[page - 1];
                            var min = pageElement.reduce(function (prev, curr) {
                                return prev.value.bounds.top < curr.value.bounds.top ? prev : curr;
                            });
                            return min.value.bounds.top - pageElement.offset.top;
                        }

                        function renderPage(number, body, header, footer) {
                            if (number > 1) {
                                doc.addPage();
                            }
                            doc.setPage(number);

                            render(body)
                            if (footer.length) {
                                render(footer)
                            }

                            if (header.length) {
                                render(header)
                            }

                            renderPageInfo('Page ' + number + ' of ' + doc.numberOfPages, { right: 15, bottom: 15 }, 'bottom-right');
                        }

                        function renderPageInfo(text, margin, alignment) {
                            doc.setTextColor(0, 0, 0);
                            doc.setFontSize(10);
                            var dims = doc.getTextDimensions(text);
                            var x, y;
                            switch (alignment) {
                                case 'bottom-right':
                                    x = docDims.outside - ((margin.right || 0) + dims.w);
                                    y = docDims.height - ((margin.bottom || 0));
                                    break
                                case 'bottom-left':
                                    x = margin.left || 0;
                                    y = docDims.height - ((margin.bottom || 0) + dims.h);
                                    break
                                default:
                                    x = margin.left || 0;
                                    y = margin.top || 0;
                            }
                            doc.text(x, y, text);
                        }

                        function getSection(section) {
                            var deferred = $q.defer();
                            var isObject = (typeof section === 'object');
                            var isBody = (section === 'body') ? true : false;
                            if (options[section] || isObject || isBody) {
                                var sectionEl;
                                var canvas = [];
                                if (isObject) {
                                    sectionEl = angular.element(section);
                                } else if (isBody) {
                                    sectionEl = el;
                                } else {
                                    sectionEl = el.find(options[section]);
                                }
                                canvas.offset = sectionEl.position();
                                canvas.dims = {
                                    height: isBody ? sectionEl[0].scrollHeight : sectionEl.outerHeight(true)
                                }

                                html2canvas(sectionEl, {
                                    logging: false,
                                    renderer: ObjRenderer,
                                    canvas: canvas,
                                    onclone: function (doc, node) {
                                        var sectionsToRemove
                                        if (isBody) {
                                            sectionsToRemove = sections.filter(function (obj) { return obj.selector }).map(function (obj) { return obj.selector });
                                        }
                                        cloneOperations(doc, node, sectionsToRemove)
                                    }
                                }).then(function (canvas) {
                                    deferred.resolve(canvas)
                                }).catch(function (msg) {
                                    console.log(msg)
                                });

                            } else {
                                deferred.resolve([]);
                            }
                            return deferred.promise
                        }

                        function render(canvas) {
                                console.log('canvas', canvas);
                                startingPos = canvas.offset || { left: 0, top: 0 }
                                for (var elIndex = 0; elIndex < canvas.length; elIndex++) {
                                    var renderElement = canvas[elIndex];

                                    switch (renderElement.type) {
                                        case 'font':
                                            handleFont(renderElement.value);
                                            break;
                                        case 'text-shadow':
                                            handleTextShadow(renderElement.value);
                                            break;
                                        case 'text':
                                            handleText(renderElement.value);
                                            break;
                                        case 'rectangle':
                                            handleRect(renderElement.value);
                                            break;
                                        case 'image':
                                            handleImg(renderElement.value);
                                            break;
                                        case 'shape':
                                            handleShape(renderElement.value);
                                            break;
                                        default:
                                            handleDefault(renderElement);
                                    }
                                }
                        }

                        function savePdf() {
                            doc.save('Test.pdf')

                            scope.busy = false;
                        }

                        function cloneOperations(document, node, sectionsToRemove) {
                            var pdfArea = angular.element(node);
                            angular.element(document).find('body').addClass(pdfClass)

                            if (sectionsToRemove && sectionsToRemove.length) {
                                for (var removeSection = 0; removeSection < sectionsToRemove.length; removeSection++) {
                                    var section = sectionsToRemove[removeSection];
                                    pdfArea = removeNode(section, pdfArea);
                                }
                            }

                            //el.css('position', 'static');
                            //el.css('height', 'auto');
                            //wrappedDoc.width(docDims.inside)
                            pdfArea.width(docDims.inside)
                            
                            pdfArea = fixBootstrapColumns(pdfArea)
                            
                            pdfArea.find('.hidepdf').hide()
                            pdfArea.find('.ng-hide').hide()
                            //var omitted = pdfArea[0].getElementsByClassName('hidepdf')
                            //angular.element(omitted).hide()
                            if (options.cloneOperations) {
                                performOptions(options.cloneOperations, pdfArea)
                            }

                        }


                        function removeNode(selector, element) {
                            element.find(selector).remove();
                            return element;
                        }

                        function fixBootstrapColumns(pdfArea) {
                            var test = pdfArea.find("[class*='col-md']")
                            for (var iColumn = 0; iColumn < test.length; iColumn++) {
                                var selected = test[iColumn];
                                var cssClass = selected.className.split(' ').find(function(el, index){
                                    return el.startsWith('col-md');
                                })
                                var columnIdentifier = parseInt(cssClass.substring(7))
                                if (columnIdentifier) {
                                    var columnWidth = selected.parentNode.clientWidth * (columnIdentifier / 12) - 15;
                                    angular.element(selected).width(columnWidth).css('float', 'left');
                                }

                            }
                            return pdfArea;
                        }

                        function performOptions(options, clone) {
                            for (var option = 0; option < options.length; option++) {
                                var obj = options[option]; //select, operation, value
                                var element = clone.find(obj.select);
                                switch (obj.operation) {
                                    case 'limit':
                                        for (var selectedElement = 0; selectedElement < element.length; selectedElement++) {
                                            var wrapped = angular.element(element[selectedElement])
                                            wrapped.html(wrapped.html().substring(0, obj.value));
                                        }
                                        break;
                                    case 'replace-text':
                                        for (var selectedElement = 0; selectedElement < element.length; selectedElement++) {
                                            var wrapped = angular.element(element[selectedElement])
                                            wrapped.text(obj.value);
                                        }
                                        break;
                                    default:

                                }
                            }
                        }

                        function handleFont(value) {
                            //var font = value.family.split(',')[0];
                            //if (font) doc.setFont(font);
                            var size = parseFloat(value.size);
                            if (size) doc.setFontSize(size);

                            var weight = value.weight;
                            if (parseInt(weight) >= 600) {
                                doc.setFontType('bold');
                            } else {
                                doc.setFontType('normal');
                            }

                            var color = value.color;
                            lastColor = color;
                            doc.setTextColor(color.r, color.g, color.b);
                            //debugger
                        }

                        function handleTextShadow(value) {
                            var x = value.left - startingPos.left;
                            var y = value.top - startingPos.top;
                            var color = value.shadow.color;
                            if (x && y) {
                                var dims = doc.getTextDimensions(value.text);
                                y += (dims.h / 1.3)
                                doc.setTextColor(color.r, color.g, color.b);
                                doc.text(x, y, value.text, null, (value.angle * -1) || 0);

                                doc.setTextColor(lastColor.r, lastColor.g, lastColor.b);
                            }
                        }

                        function handleText(value) {
                            var x = value.bounds.left - startingPos.left;
                            var y = value.bounds.top - startingPos.top;
                            if (x && y) {
                                var dims = doc.getTextDimensions(value.text);
                                var newY = y + (dims.h / 1.3)
                                if (value.link) {
                                    doc.textWithLink(value.text, x, newY, { url: value.link });
                                } else {

                                    doc.text(x, newY, value.text, null, (value.angle * -1) || 0);
                                }
                            }
                            //debugger
                        }

                        function handleRect(value) {
                            if(value.stroke)
                            debugger
                            var x = value.left - startingPos.left;
                            var y = value.top - startingPos.top;
                            var color = value.color;
                            doc.setFillColor(color.r, color.g, color.b);
                            doc.rect(x, y, value.width, value.height, 'F');
                        }

                        function handleImg(value) {
                            var x = value.dx - startingPos.left;
                            var y = value.dy - startingPos.top;
                            var canvas = value.image;
                            if (canvas.nodeName === 'IMG') {
                                canvas = document.createElement('canvas');
                                canvas.width = value.dw;
                                canvas.height = value.dh;
                                var context = canvas.getContext('2d');
                                context.drawImage(value.image, 0, 0, canvas.width, canvas.height);
                            }
                            var data = canvas.toDataURL('image/jpg').slice('data:image/jpg;base64,'.length);
                            // Convert the data to binary form
                            data = atob(data)

                            doc.addImage(data, 'JPG', x, y, value.dw, value.dh);
                        }

                        function handleShape(value) {
                            var color = value.color;
                            //if (color.r === 0 && color.g === 0 && color.b === 0) { //black lines
                            //    return;
                            //}
                            doc.setLineWidth(1);
                            doc.setDrawColor(color.r, color.g, color.b);
                            var startingPoint;
                            for (var iPoint = 0; iPoint < 2; iPoint++) {
                                var point = value.shape[iPoint];
                                var coord = {
                                    x: point[1] - startingPos.left,
                                    y: point[2] - startingPos.top
                                }
                                point.coord = coord;
                                if (iPoint === 0) {
                                    startingPoint = coord;
                                } else {
                                    var previous = value.shape[iPoint - 1].coord
                                    doc.line(previous.x, previous.y, coord.x, coord.y);
                                }
                                if (iPoint === value.shape.length - 1) { //Last coordinate
                                    doc.line(coord.x, coord.y, startingPoint.x, startingPoint.y)
                                }
                            }
                        }

                        function handleDefault(renderElement) {
                           // debugger
                        }

                        
                    }

                },
                controllerAs: 'vm'
            }
        }]);


})();