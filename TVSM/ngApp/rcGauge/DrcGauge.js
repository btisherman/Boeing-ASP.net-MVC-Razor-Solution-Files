(function () {
    'use strict';

    angular.module('rcGauge', [])
    .directive('rcGaugeDisplay', [
        function () {
            return {
                restrict: 'AE',
                scope: {
                    value: '=',
                    trend: '=?'
                },
                templateUrl: server + '/ngApp/rcGauge/partials/gauge-partial.html',
                controller: [function () {
                    var vm = this;
                   
                }],
                controllerAs: 'vm',
                link: function (scope, el, attrs) {
                    var center = 150;
                    scope.$watch('value', function (newVal) {
                        calculateGauge(newVal);
                    });

                    function calculateGauge(value) {
                        var gauge = d3.select(el[0]);
                        var trend = scope.trend
                        if (trend) {
                            if (trend === 1) {
                                gauge.select('#trendUp').attr('visibility', 'visible')
                            } else if (trend === -1) {
                                gauge.select('#trendDown').attr('visibility', 'visible')
                            } else {
                                gauge.select('#trendSame').attr('visibility', 'visible')
                            }
                        } else {
                            gauge.select('.trend-arrow').attr('visibility', 'hidden')
                        }
                        var valueNum = parseFloat(value);
                        if (!isNaN(valueNum) && valueNum >= 0 && valueNum <= 10) {
                            var rounded = Math.round(valueNum);
                            if(rounded < 1){ rounded = 1 }
                            var rotationFactor = rounded - 1;
                            gauge.select('#dial').transition().attr('transform', 'rotate(' + (rotationFactor * 30.5) + ')')
                            var valueElement = gauge.select('#value')
                            valueElement.text(rounded);
                            if (rounded > 7) {
                                valueElement.style('fill', '#80bd01');
                            } else if (rounded > 3) {
                                valueElement.style('fill', '#faa31b');
                            } else {
                                valueElement.style('fill', '#ec0928');
                            }
                        }
                        else {
                            gauge.select('#value').html('-');
                            gauge.select('#dial').attr('transform', 'rotate(0)')
                        }
                        
                        
                    };
                }
            }
        }]);


})();