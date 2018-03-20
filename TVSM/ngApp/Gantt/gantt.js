d3.custom.gantt = function() {
    var formatFromExtract = d3.time.format("%m/%d/%y"),
        formatFromNotes = d3.time.format("%b %-d %Y %-I:%M:%S %p"),
        margin = { "top": 25, "right": 0, "bottom": 0, "left": 200 },
        lineHeight = 70,
        barHeight = 25,
        itemsPerPage = 24,
        extend = 80,
        colors = d3.scale.category10().domain(d3.range(0, 10)),
        xscale = d3.time.scale(),
        symbolSize = 12,
        query;

    var titleProperties = [
        'Tool Number', //display: 'Tool Number' },
        'Order ID', //display: 'Order' },
        'Plan Status'//, display: 'Status' }
    ];

    var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient('top')
    .tickFormat("")
    .tickSize(20, 0);

    var xValues = d3.svg.axis()
    .scale(xscale)
    .orient('top')
    .tickSize(5);

    var equilTri = function (triangleHeight) {
        var sideLength = (2 * triangleHeight) / Math.sqrt(3);
        var firstPoint = -(sideLength / 2);
        var pathDefinition = 'M0 0 L' + firstPoint + ' ' + -triangleHeight + ' ' + 'L' + sideLength / 2 + ' ' + -triangleHeight + ' Z';
        return pathDefinition;
    }

    //declare variables to hoist scope of svg entities
    var labels, clipPath, labelBackground, axisContainer, axisContainer2, headerTitle, div,
        svg, canvas, bgRect, today, bars, totalbar, percentbar, gradientrect, suppdate, delivery, slideline,
        cafline, startText, compText, leftpane, leftpaneBg, titles, titleProps, orders, status, dividers, details, signoffs, operations;
    var dispatch = d3.dispatch('clickLabel');
    function chart(selection) {
        selection.each(function (dataArray) {

            var container = d3.select(this);

            var singleItem = dataArray.length === 1 ? true : false;
            if (singleItem) {
                query = dataArray[0].tool;
            }
            //console.log(singleItem);
            dataArray.forEach(function (d) {
                if (!d.hasOwnProperty('mesOrder')) {
                    d.mesOrder = {};
                    d.mesOrder.Signoffs = [];
                    d.mesOrder.OperationData = [];
                }
                d.start = d['Scheduled Start'] ? new Date(d['Scheduled Start']) : new Date();
                d.comp = d['Scheduled Complete'] ? new Date(d['Scheduled Complete']) : new Date();
                d.percentdec = (d['ETVS %'] || 0 )/ 100;
                d.suppdate = new Date(d['Supplier ECD']) || 0;
                d.ToolReceived = new Date(d.ToolReceived) || 0;
                d.duration = d3.time.days(d.start, d.comp).length;
                d.slides = [];
                d.cafs = [];
                d.status = d.status || "";
                d.order = d['Order ID']
                if (d.ETVS_Notes) {
                    var aLines = d.ETVS_Notes.split("\n");
                    for (var iLine = aLines.length - 1; iLine >= 0; iLine--) {
                        var iSlidePos = aLines[iLine].indexOf("-- Supplier Comp changed from ");
                        var iCAFPos = aLines[iLine].indexOf("-- CAF Hours changed from ");

                        if (iSlidePos !== -1) {

                            var firstDate = formatFromExtract.parse(aLines[iLine].substring(iSlidePos + 30, iSlidePos + 30 + 8));
                            var secondDate = formatFromExtract.parse(aLines[iLine].substring(iSlidePos + 42, iSlidePos + 42 + 8));

                            var mySlide = { "start": firstDate, "end": secondDate, "dur": d3.time.days(firstDate, secondDate).length };
                            d.slides.push(mySlide);

                        }
                        if (iCAFPos !== -1) {
                            var sFirstCAF, sSecondCAF;
                            var aSplitCAF = aLines[iLine].split(" ");
                            var myDate = aSplitCAF[0] + " " + aSplitCAF[1] + " " + aSplitCAF[2] + " " + aSplitCAF[3] + " " + aSplitCAF[4];
                            for (var iCAFWord = 1; iCAFWord < aSplitCAF.length; iCAFWord++) {
                                if (aSplitCAF[iCAFWord].indexOf("from") !== -1) {
                                    sFirstCAF = +aSplitCAF[iCAFWord + 1];
                                }
                                if (aSplitCAF[iCAFWord].indexOf("to") !== -1) {
                                    sSecondCAF = +aSplitCAF[iCAFWord + 1];
                                }
                            }
                            if (isNaN(sFirstCAF)) {
                                sFirstCAF = 0;
                            }

                            var myCAF = { "start": sFirstCAF, "end": sSecondCAF, "hours": sSecondCAF + d.bid, "date": formatFromNotes.parse(myDate) };

                            myCAF.plainDate = formatFromNotes(myCAF.date);
                            d.cafs.push(myCAF);
                        }

                    }
                }

            });

            //calculated variables
            var width = container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = dataArray.length * lineHeight,
                barY = (lineHeight - barHeight) / 2,
                titleStub = query ? query.toUpperCase() : 'Tools',
                titleText = titleStub + " AS OF " + formatFromExtract(new Date()),
                titleData = dataArray.map(function (obj) {
                    var rObj = {};
                    for (var iProp = 0; iProp < titleProperties.length; iProp++) {
                        var propName = titleProperties[iProp];
                        var newPropName = propName.charAt(0).toUpperCase() + propName.slice(1);
                        rObj[newPropName] = obj[propName];
                    }
                    return rObj;
                });
            console.log(titleData);
            //determine domain by offsetting max and min dates by offset variable
            xscale.domain([d3.time.day.offset(d3.min(dataArray, function (d) { return d.start; }), -extend), d3.time.day.offset(d3.max(dataArray, function (d) { return d.comp; }), extend)])
                                       .range([0, width]);


            var labelDiv = container.selectAll('#labels').data([1]);
            labelDiv.enter().append("div")
                    .attr("id", "labels")
                    .call(headerEnter)

            function headerEnter(caller) {

                div = container.append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

                labels = caller.append('svg');

                var defs = labels.append('defs');
                var clip = defs.append('clipPath')
                    .attr('id', 'axisClip');
                clipPath = clip.append('rect');

                labelBackground = labels.append("rect")
                .attr('class', 'labelBackground')
                .attr('x', 0)
                .attr('y', 0);

                axisContainer = labels.append('g')
                        .attr('id', 'axis')
                        .attr('class', 'x axis');

                axisContainer2 = labels.append('g')
                        .attr('id', 'axisLabels')
                        .attr('class', 'x axis labels');

                //headerTitle = labels.append("text")
                //.attr("y", 30)
                //.attr("text-anchor", "middle")
                //.style("font-size", "24px");

            }

            var rowData = container.selectAll("div.ganttRow")
                .data(dataArray, function (d) { return d.order; });

            rowData.enter()
            .append("div")
                .attr("class", "ganttRow")
                .call(rowEnter);

            var exiting = rowData.exit();
            exiting
                //.transition()
                //.duration(500)
               // .style('opacity', 0)
                .remove();

            //create line break divs
            rowData.each(function (d, i) {
                if (i !== 0 && i % itemsPerPage === 0) { d3.select(this).append("div").attr("class", "page-break").style("height", margin.top + "px"); }
            });


            function rowEnter(row) {

                svg = row.append("svg")
                   .attr('class', 'GanttRow');

                gradient = svg.append("svg:defs")
                   .append("svg:linearGradient")
                   .attr("id", "gradient")
                   .attr("x1", "0%")
                   .attr("y1", "0%")
                   .attr("x2", "0%")
                   .attr("y2", "100%")
                   .attr("spreadMethod", "pad");

                gradient.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", "#FFFFFF")
                .attr("stop-opacity", 0.5);

                gradient.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", "#FFFFFF")
                .attr("stop-opacity", 0);

                canvas = svg.append("g")
                           .attr("class", "canvas")
                           .style("cursor", "move");


                bgRect = canvas.append("rect")
                   .attr("class", "backgroundRect");

                today = canvas.append("line")
                               .attr("class", "today")
                               .attr("y1", 0);

                bars = canvas.append("g")
                                   .attr("class", "bargroup");

                totalbar = bars.append("rect")
                                       .attr("class", "totalbar")
                                       .attr("rx", 5)
                                       .attr("ry", 5);

                percentbar = bars.append("rect")
                                       .attr("class", "percentbar")
                                       .attr("rx", 5)
                                       .attr("ry", 5);

                gradientrect = bars.append("svg:rect");



                delivery = canvas.append("line")
                   .attr("class", "delivery");

                slideline = canvas.selectAll("line.slideline").data(function (d) { return d.slides; }).enter().append("line")
                   .attr("class", "slideline");

                cafline = canvas.selectAll("path.cafline").data(function (d) { return d.cafs; }).enter().append("path")
                   .attr("class", "cafline");


                signoffs = canvas.selectAll("line.signoff").data(function (d) { return d.mesOrder.Signoffs; }).enter().append("line")
                   .attr("class", "signoff");

                operations = canvas.selectAll("line.operation").data(function (d) { return d.mesOrder.OperationData; }).enter().append("line")
                   .attr("class", "operation");

                suppdate = canvas.append("path")
                   .attr("class", "suppdate");

                startText = canvas.append("text")
                               .attr("text-anchor", "end")
                               .attr("dy", ".35em");

                compText = canvas.append("text")
                               .attr("text-anchor", "start")
                               .attr("dy", ".35em");

                leftpane = svg.append("g")
                   .attr("class", "leftpane");

                leftpaneBg = leftpane.append("rect")
                    .attr("class", "titlearea");

                titles = leftpane.append("text")
                                   .attr("class", "title")
                                   .attr("x", 5)
                                   .attr("y", 20);

                toolIndex = titles.append('tspan')
                                   .attr('class', 'toolIndex')

                titleProps = titles.selectAll("tspan.titleProps").data(function (d, i) { return d3.entries(titleData[i]); }).enter().append("tspan")
                    .attr('class', 'titleProps');

                dividers = leftpane.append("line")
                       .attr("class", "divider")
                       .attr("x1", 0)
                       .attr("y1", 0)
                       .attr("y2", 0)
                       .attr("stroke", "darkgray")
                       .attr("stroke-width", 1);
            }

            //resolve static attributes
            update();
            //resolve dynamic attributes
            dynamic();

            var zoom = d3.behavior.zoom()
           .x(xscale)
           .on('zoom', dynamic)
           .scaleExtent([0.5, 20]);

            if (singleItem) { single(); }
            function update() {
                //Header
                labels = container.select('#labels svg')
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", margin.top);

                clipPath
                    .attr('x', 0)
                    .attr('y', -height)
                    .attr('width', width)
                    .attr('height', height);

                labelBackground
                    .attr('height', margin.top)
                    .attr('width', width + margin.left);

                axisContainer
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

                axisContainer2
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .attr('clip-path', 'url(#axisClip)');

                //headerTitle
                //    .attr("x", width / 2 + margin.left)
                //    .text(titleText);

                //Rows
                rowData
                    .style("width", width + margin.left + margin.right + "px");

                svg
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", lineHeight);

                canvas.attr('transform', 'translate(' + margin.left + ', 0)');

                bgRect
                 .attr("width", width)
                 .attr("height", lineHeight);

                today
                            .attr("x1", xscale(new Date()))
                            .attr("x2", xscale(new Date()))
                            .attr("y2", lineHeight);

                bars
                                .on("mouseover", function (d) {
                                    div.transition()
                                       .duration(200)
                                       .style("opacity", 0.9)
                                    div.html("Duration: " + d.duration + " days<br />" + d['ETVS %'] + "% Complete")
                                    .style("left", (d3.event.pageX + 15) + "px")
                                    .style("top", (d3.event.pageY + -30) + "px");
                                })
                                .call(tooltip, 15, -30);

                totalbar
                                 .attr("y", barY)
                                 .attr("height", barHeight);

                percentbar
                                 .classed("behind", function (d) {
                                     // check to see if percentage complete is less than the today mark
                                     if (xscale(new Date()) > d.percentdec * (xscale(d.comp) - xscale(d.start)) + xscale(d.start)) { return true; }
                                     else { return false; }
                                 })
                                .classed('late', function (d) {
                                    return xscale(new Date()) > xscale(d.comp) ? true : false;
                                })
                                 .attr("height", barHeight)
                                 .attr("y", barY);

                gradientrect
                                    .attr("y", barY)
                                    .attr("height", barHeight * 0.3)
                                    .style("fill", "url(#gradient)");

                suppdate
                            //.attr("y1", (lineHeight - barHeight) / 4)
                            //.attr("y2", barY)
                            .attr('d', equilTri(symbolSize))
                            //make line disappear if supplier date is undefined
                            .style("opacity", function (d) { d.suppdate === 0 ? 0 : 1; });

                delivery
                            .attr("y1", (lineHeight - barHeight) / 4)
                            .attr("y2", barY)
                            //make line disappear if delivery date is undefined
                            .style("opacity", function (d) { d.ToolReceived === 0 ? 0 : 1; });

                slideline
                         .attr("y1", 3 * (lineHeight - barHeight) / 8)
                         .attr("y2", 3 * (lineHeight - barHeight) / 8)
                         .on("mouseover", function (d, i) {
                             div.transition()
                                 .duration(200)
                                 .style("opacity", 0.9);
                             div.html("Slide " + (i + 1) + ": " + d.dur + " days<br />")
                                 .style("left", (d3.event.pageX + 15) + "px")
                                 .style("top", (d3.event.pageY - 30) + "px");
                         })
                                 .call(tooltip, 15, -30);

                signoffs
                         .attr("y1", (lineHeight - barHeight))
                         .attr("y2", (lineHeight - barHeight))
                         .on("mouseover", function (d, i) {
                             div.transition()
                                 .duration(200)
                                 .style("opacity", 0.9);
                             div.html("Group: " + d.GROUP_NAME + "<br />" + (d.COMMENTS || "No comments") + "<br /> In queue for " + d.Days_In_Signoff + " days.")
                                 .style("left", (d3.event.pageX + 15) + "px")
                                 .style("top", (d3.event.pageY - 30) + "px");
                         })
                                 .call(tooltip, 15, -30);

                operations
                         .attr("y1", function (d, i) { return lineHeight * .9; })
                         .attr("y2", function (d, i) { return lineHeight * .9; })
                         //.attr("stroke", function (d, i) { return colors(i); })
                         .on("mouseover", function (d, i) {
                             div.transition()
                                 .duration(200)
                                 .style("opacity", 0.9);
                             div.html("Group: " + d.WorkLoc + "<br />" + d.OperNo + ': ' + d.DESCRIPTION)
                                 .style("left", (d3.event.pageX + 15) + "px")
                                 .style("top", (d3.event.pageY - 30) + "px");
                         })
                                 .call(tooltip, 15, -30);

                cafline
                         .attr('d', equilTri(symbolSize));

                startText
                             .text(function (d) { return formatFromExtract(d.start); })
                             .attr("y", lineHeight / 2);

                compText
                            .text(function (d) { return formatFromExtract(d.comp); })
                            .attr("y", lineHeight / 2);

                leftpaneBg
                            .attr("width", margin.left)
                            .attr("height", lineHeight);

                toolIndex
                    .text(function (d, i) { return (i + 1) + '.  ' });

                titleProps
                    //if property is first in the list, or empty, display just the value.  Otherwise, key and value.
                     .text(function (d, i) { return i && d.value ? d.key + ': ' + d.value : d.value; })
                    //left justify if not first in the list.
                     .attr('x', function (d, i) { return i ? 5 : undefined })
                    //new line if not first in the list.
                     .attr('dy', function (d, i) {return i ? 20 : 0;})
                     .attr('class', function (d) { return 'title ' + d.key; });

                //titles.select('.Tool_Number')
                //.on('click', function (d) {
                //    onClick(d.order);
                //})
                //.style('cursor', 'pointer');

                titles.select('.Order')
                .on('click', dispatch.clickLabel)
                .style('cursor', 'pointer');

                dividers
                            .attr("x2", width + margin.left);


            }
            function dynamic() {

                totalbar
                    .attr("x", function (d) { return xscale(d.start); })
                    .attr("width", function (d) { return xscale(d.comp) - xscale(d.start); });

                percentbar
                    .attr("x", function (d) { return xscale(d.start); })
                    .attr("width", function (d) { return d.percentdec * (xscale(d.comp) - xscale(d.start)); });

                gradientrect
                    .attr("x", function (d) { return xscale(d.start); })
                    .attr("width", function (d) { return xscale(d.comp) - xscale(d.start); });

                today
                    .attr("x1", xscale(new Date()))
                    .attr("x2", xscale(new Date()));

                suppdate
                    .attr('transform', function (d) { return 'translate(' + xscale(d.suppdate) + ',' + barY + ')' });
                    //.attr("x1", function (d) { return xscale(d.suppdate); })
                    //.attr("x2", function (d) { return xscale(d.suppdate); });

                delivery
                    .attr("x1", function (d) { return xscale(d.ToolReceived); })
                    .attr("x2", function (d) { return xscale(d.ToolReceived); });

                slideline
                    .attr("x1", function (d) { return xscale(d.start); })
                    .attr("x2", function (d) { return xscale(d.end)-1; });

                cafline
                    .attr('transform', function (d) { return 'translate(' + xscale(d.date) + ',' + barY + ')' });

                signoffs
                    .attr("x1", function (d) { return xscale(new Date(d.Date_In_Queue)); })
                    .attr("x2", function (d) { return xscale(new Date(d.ACTUAL_FINISH_DATE))-1; });

                operations
                    .attr("x1", function (d) { return d.DATESTARTACTL === null ? xscale(new Date()) : xscale(new Date(d.DATESTARTACTL)); })
                    .attr("x2", function (d) { return d.DATECOMPACTL === null ? xscale(new Date()) : xscale(new Date(d.DATECOMPACTL))-1; });
                    

                startText.attr("x", function (d) { return xscale(d.start) - 10; });

                compText.attr("x", function (d) { return xscale(d.comp) + 10; });

                xValues.tickValues(midOfMonth(new Date(xscale.invert(0)), new Date(xscale.invert(width)), getInverval().interval));
                xValues.tickFormat(getInverval().format);
                xAxis.ticks(getInverval().interval);
                axisContainer.call(xAxis);
                axisContainer2.call(xValues).selectAll('.tick line').style('opacity', 0);

            }
            function single() {
                //container.selectAll('text.title')
                //    .on('click', function (d) {
                //        container.selectAll('*').remove();
                //        onClick();
                //    });
                toolIndex.remove();
                    details = container.selectAll('div.ganttRow').append('div');
                details.append('span')
                    .text(function (d) {
                        return 'Supplier: ' + d.SupplierShop;
                    });
            }

            function getInverval() {
                var milliExtent = (new Date(xscale.invert(width))).getTime() - (new Date(xscale.invert(0))).getTime();
                var timeExtent = milliExtent / (24 * 60 * 60 * 1000);

                var myInterval;
                var myFormat;
                if (timeExtent > 300) {
                    myInterval = d3.time.year;
                    myFormat = d3.time.format('%Y');
                } else if (timeExtent > 60) {
                    myInterval = d3.time.month;
                    myFormat = d3.time.format('%B');
                } else {
                    myInterval = d3.time.day;
                    myFormat = d3.time.format('%-d');
                }
                return {
                    interval: myInterval,
                    format: myFormat
                };
            }

            function midOfMonth(dStartDate, dEndDate, myInterval) {
                var aDates = [];
                while (dStartDate < dEndDate) {
                    var dStart = myInterval.floor(dStartDate);
                    var dEnd = myInterval.ceil(dStartDate);
                    var iMid = (dEnd.getTime() - dStart.getTime()) / 2;
                    aDates.push(new Date(dStart.getTime() + iMid));
                    dStartDate = myInterval.offset(dStartDate, 1);
                }
                return aDates;
            }

            function tooltip(selection, xOffset, yOffset) {
                selection
                    .on("mousemove", function () {
                        div
                            .style("left", (d3.event.pageX + xOffset) + "px")
                            .style("top", (d3.event.pageY + yOffset) + "px");
                    })
                    .on("mouseout", function () {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0)
                        ;
                    });
            }
            zoom(canvas);
        });
    }

    chart.renderLegend = function (selection) {
        selection.each(function () {
            var container = d3.select(this);
            var legendData = [
                { name: 'Supplier Commited Date', selection: 'suppdate', path: equilTri(symbolSize) },
                { name: 'CAF for hours adjustment', selection: 'cafline', path: equilTri(symbolSize) },
                { name: 'Schedule slide', selection: 'slideline', path: 'M' + -symbolSize + ' 0 L' + symbolSize + ' 0' },
                { name: 'MES Signoffs', selection: 'signoff', path: 'M' + -symbolSize + ' 0 L' + symbolSize + ' 0' },
                { name: 'MES Operations', selection: 'operation', path: 'M' + -symbolSize + ' 0 L' + symbolSize + ' 0' }
            ];

            var symbolSvgSize = symbolSize + 5;
            var legendTable = container.append('table')
                            .classed('table', true);

            var tHead = legendTable.append('thead').append('tr');
            tHead.append('td').append('strong').text('Symbol')
            tHead.append('td').append('strong').text('Description')

            var tBody = legendTable.append('tbody');

            var legendTr = tBody.selectAll('tr').data(legendData).enter().append('tr');
            var symbolSvg = legendTr.append('td').append('svg')
                .attr('height', symbolSvgSize)
                .attr('width', symbolSvgSize)
            .on("click", function (d) {
                var thisSymbol = d3.select(this)
                // Determine if current line is visible
                var isHidden = thisSymbol.classed('hideSymbol') ? true : false;
                var newLegendOpacity = isHidden ? 1 : .5;
                var newVisibility = isHidden ? 'visible' : 'hidden';
                console.log(isHidden);
                d3.selectAll('.' + d.selection).style('visibility', newVisibility)
                thisSymbol.selectAll('.' + d.selection).style('opacity', newLegendOpacity).style('visibility', 'visible')
                thisSymbol.classed('hideSymbol', !isHidden)
            })
            symbolSvg.append('path')
            .attr('class', function (d) { return d.selection })
            .attr('d', function (d) { return d.path })
            .attr('transform', 'translate(' + symbolSvgSize / 2 + ',' + symbolSize + ')')
            legendTr.append('td').text(function (d) { return d.name });
        })
    }

    chart.lineHeight = function (_) {
        if (!arguments.length) return lineHeight;
        lineHeight = _;
        return chart;
    };

    chart.barHeight = function (_) {
        if (!arguments.length) return barHeight;
        barHeight = _;
        return chart;
    };

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };


    //chart.onClick = function (_) {
    //    if (!arguments.length) return onClick;
    //    onClick = _;
    //    return chart;
    //};

    //chart.onClick2 = function (_) {
    //    if (!arguments.length) return onClick2;
    //    onClick2 = _;
    //    return chart;
    //};

    chart.query = function (_) {
        if (!arguments.length) return query;
        query = _;
        return chart;
    };

    d3.rebind(chart, dispatch, 'on');
    return chart;
}
