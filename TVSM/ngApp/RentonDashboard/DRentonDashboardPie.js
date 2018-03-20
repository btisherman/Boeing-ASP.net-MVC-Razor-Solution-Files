(function () {
    angular.module('RentonDashboard')

    //D3 Factory
    .factory('d3', function () {
        return d3;
    })

    //Pie Directive
    .directive('rentonDashboardPieChart', ['d3', '$window',
        function (d3, $window) {
            return {
                restrict: 'E',
                template: '<div class="chart"></div>',
                replace: true,
                scope: {
                    'data': '=',
                    'pieClick': '=',
                    'config': '=?',
                    'pieId': '@?'
                },


                //Return the link function
                link: function (scope, element, attrs) {
                    var chart = d3.custom.pie();
                    var chartEl = d3.select(element[0]);

                    //Watch the config attribute of the scope
                    scope.$watch('config', function (newVal) {
                        var config = newVal;
                        chart.margin(config.margin || 0);
                        chart.isDonut(config.isDonut || true);
                        chart.donutRatio(config.donutRatio || .5);
                        chart.totalDescription(config.totalDescription || '');
                        chart.showPercentage(config.showPercentage || false);

                        chartEl.datum(scope.data).call(chart);
                    }, true)
                    //Watch the data attribute of the scope
                    scope.$watchCollection('data', function (newVal, oldVal, scope) {
                        if (newVal) {
                            chartEl.selectAll('.notfound').remove();
                            //Update the chart
                            chart.on('customClick', function (d) {
                                scope.pieClick(d, scope.pieId);
                            });
                            chart.margin(0);
                            if (scope.config) {
                                var config = scope.config;
                                chart.margin(config.margin || 0);
                                chart.isDonut(config.isDonut || true);
                                chart.donutRatio(config.donutRatio || .5);
                                chart.totalDescription(config.totalDescription || '');
                                chart.showPercentage(config.showPercentage || false);
                            }
                            chartEl.datum(newVal).call(chart);
                        }
                        //} else {
                        //    chartEl.selectAll('*').remove();
                        //    chartEl.append('span')
                        //    .classed('notfound', true)
                        //    .text('None');
                        //}
                    });
                    var win = angular.element($window);
                    win.bind("resize", function (e) {

                        console.log("sup from resize");
                        chartEl.selectAll('*').remove();
                        chartEl.datum(scope.data).call(chart);

                    });
                }
            }
        }
    ])

    //PieLegend Directive
    .directive('pieLegend', ['d3',
        function (d3) {
            var chart = pie();

            return {
                restrict: 'E',
                template: '<div></div>',
                replace: true,
                scope: {
                    //data: '=',
                    //config: '='
                },


                //Return the link function
                link: function (scope, element, attrs) {
                    var chartEl = d3.select(element[0]);

                    chart.renderLegend(chartEl)
                }
            }
        }
    ]);

})();
