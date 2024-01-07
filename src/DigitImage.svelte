

<script lang="ts">
    import { onMount } from "svelte";

    export let width: number;
    export let height: number;
    export let isParam = false;
    export let pixels: number[] = [];

    let canvas: HTMLCanvasElement;
    let ctxt: CanvasRenderingContext2D | null;

    $: xStep = width / 28;
    $: yStep = height / 28;

    onMount(() => {
        ctxt = canvas.getContext("2d");
    });

    function redraw() {
        if (ctxt) {
            for (let y = 0; y < 28; y++) {
                for (let x = 0; x < 28; x++) {
                    let index = y*28+x;
                    let grey = Math.floor(isParam ? 127 + Math.max(-127, Math.min(127, pixels[index]*500)) : 255 * (1 - pixels[index]));
                    ctxt.fillStyle = `rgb(${grey},${grey},${grey})`;
                    ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                }
            }
        }
    }

    $: {
        if (pixels) {
            redraw();
        }
    }
</script>

<canvas bind:this={canvas} style='border:1px solid black' width={width} height={height}></canvas>