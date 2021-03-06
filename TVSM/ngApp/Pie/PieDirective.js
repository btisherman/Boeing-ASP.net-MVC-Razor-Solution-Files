﻿(function () {
    angular.module('pieChart', [])

    //D3 Factory
    .factory('d3', function () {
        return d3;
    })

    //Pie Directive
    .directive('pieChart', ['d3', '$window',
        function (d3, $window) {
            var chart = d3.custom.pie();

            return {
                restrict: 'E',
                template: '<div class="chart"></div>',
                replace: true,
                scope: {
                    'data': '=',
                    'pieClick': '&'
                },


                //Return the link function
                link: function (scope, element, attrs) {
                    var chartEl = d3.select(element[0]);
                    //Watch the data attribute of the scope
                    scope.$watchCollection('data', function (newVal, oldVal, scope) {
                        if (newVal && d3.max(d3.values(newVal), function(d){return d}) > 0) {
                            chartEl.selectAll('.notfound').remove();
                            //Update the chart
                            chart.on('customClick', function (d) {
                                scope.pieClick({cat: d.data.key });
                            });
                            chart.margin(0);
                            chartEl.datum(newVal).call(chart);
                        } else {
                            chartEl.selectAll('*').remove();
                            chartEl.append('span')
                            .classed('notfound', true)
                            .text('None');
                        }
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
