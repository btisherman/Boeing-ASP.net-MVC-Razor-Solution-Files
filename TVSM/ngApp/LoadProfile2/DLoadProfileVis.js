(function () {
    angular.module('LoadProfile2')
    .directive('loadProfileVis', [
    function () {
        return {
            restrict: 'AE',
            scope: {
                remote: '='
            },
            link: function (scope, el, attrs) {
                scope.remote = scope.remote || {};
                scope.remote.setFilter = function (value) {
                    console.log('filtering', value);
                    changeParameter('Program', value)
                }

                initViz();

                function initViz() {
                    var containerDiv = el[0];
                    url = "https://eaas-tableau-preproduction.web.boeing.com/t/TVSM/views/LoadProfile/LoadProfileDashboard";
                    options = {
                        hideTabs: true,
                        hideToolbar: true,
                        onFirstInteractive: function () {
                            workbook = viz.getWorkbook();
                            scope.workbook = workbook;
                            activeSheet = workbook.getActiveSheet();
                            scope.sheet = activeSheet.getWorksheets()[0]
                        }
                    };
                    var viz = new tableau.Viz(containerDiv, url, options);
                    viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
                }

                function changeParameter(name, value) {
                    scope.workbook.changeParameterValueAsync(
                      name,
                      value
                      )
                }

                function onMarksSelection(marksEvent) {
                    return marksEvent.getMarksAsync().then(reportSelectedMarks);
                }

                function reportSelectedMarks(marks) {
                    if (marks.length > 0) {
                        for (var i = 0; i < marks.length; i++) {
                            var pairs = marks[i].getPairs();
                            console.log(pairs)
                        }
                    }
                }
            }
        }
    }]);
})();