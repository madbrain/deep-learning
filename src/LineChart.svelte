
<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import type { Point } from "./point";

    export let data: Point[] = [];

    let el: Element;

    let svg: any;

    const margin = {top: 20, right: 20, bottom: 30, left: 40}
    const width = 400;
    const height = 400;

    let xAxis: d3.Axis<d3.NumberValue>;
    let xScale: d3.ScaleLinear<number, number>;
    let yAxis: d3.Axis<d3.NumberValue>;
    let yScale: d3.ScaleLinear<number, number>;

    function computeAxis() {
        let maxX = d3.max(data, function(d) { return d.x; }) ?? 0;
        let maxY = d3.max(data, function(d) { return d.y; }) ?? 0;
        xScale = d3.scaleLinear([0, maxX], [0, width]);
        xAxis = d3.axisBottom(xScale);

        yScale = d3.scaleLinear([0, maxY], [height, 0]);
        yAxis = d3.axisLeft(yScale);
    }

    const lineFun = d3.line<Point>()
            .x((d: Point) => xScale(d.x))
            .y((d: Point) => yScale(d.y));

    onMount(() => {
        
        computeAxis();

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

        svg.append("path")
                .attr("class", "cost")
                .attr("d", lineFun(data))
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 2);

    });

    $: {
        computeAxis();
        svg?.select("g.x.axis").call(xAxis);
        svg?.select("g.y.axis").call(yAxis);
        svg?.select(".cost").attr("d", lineFun(data));
    }

</script>
<div bind:this={el} class="chart"></div>