
export class LineChartDirective {

    public restrict = "EA";
    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    public scope = {
        chartData: "="
    };

    constructor() {
        LineChartDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            var chartData: Array<{x: number,  y: number}> = [];

            var margin = {top: 20, right: 20, bottom: 30, left: 40}
            var width = 400;
            var height = 400;

            var xAxis, xScale, yAxis, yScale;

            function computeAxis() {
                var maxX = d3.max(chartData, function(d) { return d.x; })
                var maxY = d3.max(chartData, function(d) { return d.y; })
                xScale = d3.scale.linear().range([0, width]).domain([0, maxX]);
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                yScale = d3.scale.linear().range([height, 0]).domain([0, maxY]);
                yAxis = d3.svg.axis().scale(yScale).orient("left");
            }
            computeAxis();

            var svg = d3.select(element.get(0)).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var lineFun = d3.svg.line<{x: number, y: number}>()
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            svg.append("path")
                    .attr("class", "cost")
                    .attr("d", lineFun(chartData))
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);

            scope.$watchCollection("chartData", function(newVal, oldVal) {
                chartData = <Array<{x: number, y: number}>>newVal;
                computeAxis();
                svg.selectAll("g.x.axis").call(xAxis);
                svg.selectAll("g.y.axis").call(yAxis);
                svg.selectAll(".cost").attr({ d: lineFun(chartData) });
            });
        };
    }

    public static Factory() {
        var directive = () => {
            return new LineChartDirective();
        };

        directive['$inject'] = [];

        return directive;
    }
} 