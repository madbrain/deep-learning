
interface PointRegScope extends ng.IScope {
    points: Array<{x: number, y: number}>;
    params: any
}

export class PointRegChartDirective {

    public restrict = "EA";
    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    public scope = {
        points: "=",
        params: "="
    };

    constructor() {
        PointRegChartDirective.prototype.link = (scope: PointRegScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            var points: Array<{x: number, y: number}> = scope.points;
            var params = scope.params[0].value;

            var margin = {top: 20, right: 20, bottom: 30, left: 40}
            var width = 400;
            var height = 400;

            var xValue = function(d) { return d.x; };
            var xScale = d3.scale.linear().range([0, width]).domain([-1.2, 1.2]);
            var xMap = function(d) { return xScale(xValue(d));}
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            var yValue = function(d) { return d.y; };
            var yScale = d3.scale.linear().range([height, 0]).domain([-3, 3]);
            var yMap = function(d) { return yScale(yValue(d));}
            var yAxis = d3.svg.axis().scale(yScale).orient("left");

            var svg = d3.select("div#linearReg").append("svg")
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

            svg.selectAll(".dot")
                .data(points)
                .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "blue");

            var lineFun = d3.svg.line<{x: number, y: number}>()
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            var lineData = [{x:-1, y:-1 * params.get(0, 0) + params.get(0, 1)}, {x:1, y:1 * params.get(0, 0) + params.get(0, 1)}];
            svg.append("path")
                    .attr("class", "line")
                    .attr("d", lineFun(lineData))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2);

            scope.$watch("params", function(newVal: any, oldVal) {
                params = newVal[0].value;
                var lineData = [{x:-1, y:-1 * params.get(0, 0) + params.get(0, 1)}, {x:1, y:1 * params.get(0, 0) + params.get(0, 1)}];
                svg.transition().select(".line")
                        .duration(750)
                        .attr("d", lineFun(lineData));
            }, true);

            
        };
    }

    public static Factory() {
        var directive = () => {
            return new PointRegChartDirective();
        };

        directive['$inject'] = [];

        return directive;
    }
} 