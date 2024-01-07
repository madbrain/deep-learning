
<script lang="ts">
    import { afterUpdate, createEventDispatcher, onMount } from "svelte";

    export let width: number;
    export let height: number;
    export let pixels: Array<number> = [];

    const dispatch = createEventDispatcher();
    
    let canvas: HTMLCanvasElement;
    let ctxt: CanvasRenderingContext2D | null;
    let isDrawing = false;

    $: xStep = width / 28;
    $: yStep = height / 28;

    function redraw() {
        if (ctxt) {
            for (let y = 0; y < 28; y++) {
                for (let x = 0; x < 28; x++) {
                    const index = y*28+x;
                    const grey = Math.floor(255 * (1 - pixels[index]));
                    ctxt.fillStyle = `rgb(${grey},${grey},${grey})`;
                    ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                }
            }
        }
    }

    function drawPixel(x: number, y: number) {
        if (x >= 0 && x < 28 && y >= 0 && y < 28) {
            const index = x + y*28;
            pixels[index] = 1;
            redraw();
        }
    }

    onMount(() => {
        ctxt = canvas.getContext("2d");
    });
    

   function mousedown(e: MouseEvent) {
        isDrawing = true;
    }

    function mouseup(e: MouseEvent) {
        isDrawing = false;
        dispatch("draw", pixels);
    }

   function mousemove(e: MouseEvent) {
        if (isDrawing) {
            let x = Math.floor(e.offsetX / xStep);
            let y = Math.floor(e.offsetY / yStep);
            for (let dx = -1; dx < 1; ++dx) {
                for (let dy = -1; dy < 1; ++dy) {
                    drawPixel(x + dx, y + dy);
                }
            }
        }
    }

    afterUpdate(() => {
        redraw();
    })

</script>
<div on:mousedown={mousedown} on:mouseup={mouseup} on:mousemove={mousemove}>
    <canvas bind:this={canvas} style='border:1px solid black' width={width} height={height}></canvas>
</div>