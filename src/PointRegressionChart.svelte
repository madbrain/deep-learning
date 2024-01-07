

<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from 'd3';
    import type { Point } from "./point";
    import { MatrixValueFactory } from "./matrix";
    import type { Matrix } from "./matrix";

    export let points: Point[] = [];
    export let params: Matrix = new MatrixValueFactory().matrix([[0, 0]]);

    let el: Element;

    let svg: any;

    const margin = {top: 20, right: 20, bottom: 30, left: 40}
    const width = 400;
    const height = 400;
    const xScale = d3.scaleLinear([-1.2, 1.2], [0, width]);
    const yScale = d3.scaleLinear([-3, 3], [height, 0]);
    const lineFun = d3.line<Point>()
            .x((d: Point) => xScale(d.x))
            .y((d: Point) => yScale(d.y));

    onMount(() => {
        
        let xMap = function(d: Point) { return xScale(d.x);}
        let xAxis = d3.axisBottom(xScale);
        
        let yMap = function(d: Point) { return yScale(d.y);}
        let yAxis = d3.axisLeft(yScale);

        svg = d3.select(el).append("svg")
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

        let lineData = [{x:-1, y:-1 * params.get(0, 0) + params.get(0, 1)}, {x:1, y:1 * params.get(0, 0) + params.get(0, 1)}];
        svg.append("path")
                .attr("class", "line")
                .attr("d", lineFun(lineData))
                .attr("stroke", "red")
                .attr("stroke-width", 2);

    });

    $: {
        let lineData = [{x:-1, y:-1 * params.get(0, 0) + params.get(0, 1)}, {x:1, y:1 * params.get(0, 0) + params.get(0, 1)}];
        svg?.transition().select(".line")
                .duration(300)
                .attr("d", lineFun(lineData));
    }
</script>

<div bind:this={el} class="chart"></div>