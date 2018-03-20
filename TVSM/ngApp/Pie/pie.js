d3.custom.pie = function() {
    //Static variables, setter variables
    var margin = 15;
    var label = '';
    var isDonut = true;
    var donutRatio = .4;
    var rotation = .5;
    var hoverExt = 5;
    var totalDescription;
    var total;
    var showPercentage;

    //declare variables to hoist scope of svg entities
    var dispatch = d3.dispatch('customClick');
    function chart(selection) {
        selection.each(function (dataArray) {
            if (!dataArray) {
                return;
            }
            var container = d3.select(this);

            //calculated variables
            var width = container.node().getBoundingClientRect().width - margin;
            var height = width;
            var radius = width / 2 - 5;
            var labelOffset = height + (margin / 8);
            var innerRadius = isDonut ? radius * donutRatio : 0

            var nested;

            var pie = d3.layout.pie()
                .value(function(d) { return d.values.length})
                .sort(null)
                .startAngle(rotation)
                .endAngle(2 * Math.PI + rotation);

            var dataIsObj;
            if (dataArray.constructor !== Array) {
                var entries = d3.entries(dataArray);
                nested = entries.filter(function(d){return d.value > 0})
                pie.value(function (d) { return d.value });
                dataIsObj = true;
            } else {
                nested = d3.nest()
                .key(function (d) { return d.health; })
                .entries(dataArray);
                dataIsObj = false;
            }

            total = dataIsObj ? d3.sum(nested, function (d) { return d.value }) : dataArray.length;
            if (total < 1) {
                nested = [{
                    key: 'Green',
                    value: 1
                }]
            }
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(innerRadius);

            var arcHover = d3.svg.arc()
                .outerRadius(radius + hoverExt)
                .innerRadius(innerRadius);

            var canvas = container.selectAll('svg g.canvas');
            //console.log(canvas);
            if (!canvas[0].length) {
                var svg = container.append("svg:svg")

                canvas = svg.append("g")
                        .classed('canvas', true);

                canvas.append('text')
                    .attr('class', 'totalText')
                    .attr('title', 'Total Active Orders')

                if (totalDescription) {
                    canvas.append('text')
                    .attr('class', 'totalDescriptionText')
                }
            }

            container.select('svg')
                    .attr("width", width + margin)
                    .attr("height", height + margin);

            canvas.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var pieSlice = canvas.selectAll("path")
                .data(pie(nested));

            pieSlice.enter().append("path")
                    .classed('arc', true)
                    .each(function (d) {
                        this._current = d;
                    });

            pieSlice.attr('class', function (d) { return d.data.key + 'Pie' })
                    .classed('arc', true)
                    .attr("d", arc)
                .on("mouseover", function (d) {
                    d3.select(this).transition()
                      .duration(500)
                      .attr("d", arcHover);
                })
                .on("mouseout", function (d) {
                    d3.select(this).transition()
                    .duration(500)
                    .attr("d", arc);
                })
                .on('click', function (d) {
                    dispatch.customClick(d);
                })
                    .style('cursor', 'pointer')
            .transition().attrTween("d", arcTween);

            pieSlice.exit().remove();

            var sliceLabel = canvas.selectAll(".sliceLabel")
                .data(pie(nested));

            sliceLabel.enter().append('text')
                .attr('class', 'sliceLabel');

            sliceLabel
              .attr('class', function (d) { return d.data.key + 'Label' })
              .classed('sliceLabel', true)
              .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";})
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function (d) {
                  var val = dataIsObj ? d.data.value : d.data.values.length;
                  if (showPercentage) {
                      var percent;
                      if (total > 0) {
                          percent = (val / total) * 100;
                      } else {
                          percent = 100;
                      }
                      return Math.round(percent) + '%';
                  }else{
                    return total > 0 ? val : '';
                  }
                  
              });

            sliceLabel.exit().remove();

            canvas.select('.totalText')
                .attr("dy", ".35em")
              .style("text-anchor", "middle")
                .attr("y", function () {
                    return totalDescription ? 10 : 0;
                })
              .text(function () {
                  return total;
              })
             .on('click', function (d) {
                 dispatch.customClick({data: {values: dataArray, category: d.data.key}});
                        })
                .style('cursor', 'pointer');

            canvas.select('.totalDescriptionText')
                .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .attr("y", -10)
              .text(function () {
                  return totalDescription;
              });

            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            }
        });
    }

    chart.renderLegend = function (selection) {
        selection.each(function () {
            var symbolSize = 12;
            var squarePath = 'M0 0 L' + symbolSize + ' 0 L' + symbolSize + ' ' + symbolSize + ' L0 ' + symbolSize + ' Z';
            var container = d3.select(this);
            var legendData = [
                { name: 'On Schedule', selection: 'GreenPie', path: squarePath },
                { name: 'Watch Items', selection: 'YellowPie', path: squarePath },
                { name: 'Delinquent Items', selection: 'RedPie', path: squarePath }
            ];

            var symbolSvgSize = symbolSize;
            var legendTable = container.append('table')
                            .classed('table', true)
                            //.classed('table-bordered', true);
            var tHead = legendTable.append('thead').append('tr');
            tHead.append('td').append('strong').text('Symbol')
            tHead.append('td').append('strong').text('Description')
            var tBody = legendTable.append('tbody');

            var legendTr = tBody.selectAll('tr').data(legendData).enter().append('tr');
            var symbolSvg = legendTr.append('td').append('svg')
                .attr('height', symbolSvgSize)
                .attr('width', symbolSvgSize);
            //.on("click", function (d) {
            //    var thisSymbol = d3.select(this)
            //    // Determine if current line is visible
            //    var isHidden = thisSymbol.classed('hideSymbol') ? true : false;
            //    var newLegendOpacity = isHidden ? 1 : .5;
            //    var newVisibility = isHidden ? 'visible' : 'hidden';
            //    console.log(isHidden);
            //    d3.selectAll('.' + d.selection).style('visibility', newVisibility)
            //    thisSymbol.selectAll('.' + d.selection).style('opacity', newLegendOpacity).style('visibility', 'visible')
            //    thisSymbol.classed('hideSymbol', !isHidden)
            //})
            symbolSvg.append('path')
            .attr('class', function (d) { return d.selection })
            .attr('d', function (d) { return d.path });
            legendTr.append('td').text(function (d) { return d.name });
        })
    }

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.label = function (_) {
        if (!arguments.length) return label;
        label = _;
        return chart;
    };

    chart.isDonut = function (_) {
        if (!arguments.length) return isDonut;
        isDonut = _;
        return chart;
    };

    chart.donutRatio = function (_) {
        if (!arguments.length) return donutRatio;
        donutRatio = _;
        return chart;
    };

    chart.totalDescription = function (_) {
        if (!arguments.length) return totalDescription;
        totalDescription = _;
        return chart;
    };

    chart.showPercentage = function (_) {
        if (!arguments.length) return showPercentage;
        showPercentage = _;
        return chart;
    };

    return d3.rebind(chart, dispatch, 'on');
}
