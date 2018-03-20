(function () {
"use strict";
    angular.module('miscStickyHeader', [])
    .directive('tvsmStickyHeader', ['$window', function ($window) {
        return {
            transclude: 'element',
            scope: {},
            link: function (scope, el, attr, ctrl, transcludeFn) {
                scope.isVisible = false;
                scope.wrapper = el.parent();
                scope.placeholderDiv = scope.wrapper.find(attr.tvsmStickyHeader);
                if (attr.scrollElement) {
                    scope.scrollElement = angular.element($window.document).find(attr.scrollElement);
                    scope.xScrollElement = scope.scrollElement;
                } else {
                    scope.scrollElement = angular.element($window);
                    scope.xScrollElement = scope.wrapper;
                }

                if (transcludeFn) {
                //Floating header
                    transcludeFn(function (clone) {
                                        if (clone) {
                                            clone.find('tbody').remove();
                                            scope.placeholderDiv.append(clone);
                                        }

                                    });
                 //Original transcluded content
                                transcludeFn(function (clone) {
                                    clone.addClass('tbl-transclude');
                                    scope.wrapper.append(clone);
                                });
                }

                scope.table = scope.wrapper.find('.tbl-transclude');
                scope.placeholderDiv.hide();

                scope.xScrollElement.bind("scroll", function () {
                    var x = scope.xScrollElement.scrollLeft();
                    var xOffset = attr.scrollElement ? scope.table.offset().left - 10: 0;
                        scope.placeholderDiv.css('left', xOffset + scope.xScrollElement.offset().left + (-1 * x));
                });

                scope.scrollElement.bind("scroll", function () {
                    var y, tblPosition, top;
                    if (attr.scrollElement) {
                        y = scope.scrollElement.scrollTop();
                        tblPosition = scope.table.position().top;
                        top = 10;
                    }else{
                        y = $window.pageYOffset;
                        tblPosition = scope.table.offset().top;
                        top = y;
                    }
                    var bottom = scope.table.height() + tblPosition - scope.placeholderDiv.height();
                    if (y > tblPosition && y <= bottom) {
                        scope.placeholderDiv.css('top', top);
                        scope.placeholderDiv.show();
                        scope.isVisible = true;
                    } else {
                        scope.placeholderDiv.hide();
                        scope.isVisible = false;
                    }
                });

            }
        };
    }]);


})();