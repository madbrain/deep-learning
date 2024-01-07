<script lang="ts">
    import { Button, ButtonGroup, ButtonToolbar, Card, CardBody } from "@sveltestrap/sveltestrap";
    import LineChart from "./LineChart.svelte";
    import type { Point } from "./point";
    import { onMount } from "svelte";
    import { prepareSamples, testPerformance, type Sample, type Model } from "./digitModel";
    import * as logistic from "./logisticRegression";
    import DigitImage from "./DigitImage.svelte";
    import DrawPanel from "./DrawPanel.svelte";

    let samples: Sample[] = [];
    let tests: Sample[] = [];
    let index = 0;
    let epoch = 0;
    let model: Model;
    let cost: number;
    let costs: Point[] = [];
    let started = false;
    let elements: number[][] = [];
    let performance = 0;
    let testPixels: number[] = [];
    let testResult = 0;

    let costSum = 0;
    let costCount = 0;

    let timer: number;

    onMount(() => {
        reset();
        fetch("data/trainingsamples.json")
            .then(r => r.json())
            .then(result => {
                samples = prepareSamples(result);
            });
        fetch("data/validationsamples.json")
            .then(r => r.json())
            .then(result => {
                tests = prepareSamples(result);
            });
    });

    function reset() {
        costs = [];
        model = logistic.buildModel();
        stop();
        clear();
    }

    function stop() {
        clearInterval(timer);
        started = false;
    }

    function clear() {
        testPixels = new Array(28*28).fill(0);
    }

    function start() {
        started = true;
        timer = setInterval(() => {
            train();
            if (index >= samples.length) {
                if (epoch > 25) {
                    clearInterval(timer);
                    started = false;
                }
                epoch++;
                index = 0;
            }
			if ((index % 500) == 0) {
                performance = testPerformance(model, tests) * 100;
			}
        }, 10);
    }

    function copyElements() {
        for (let i = 0; i < 10; i++) {
            elements[i] = model.params[0].value.elements[i];
        }
    }

    function train() {
        let current = samples[index];
        cost = model.train(current.pixels, current.digit);
        costSum += cost;
        costCount++;
        if (costCount >= 10) {
            costs = [ ...costs, {x: costs.length, y: costSum / costCount} ];
            costSum = 0;
            costCount = 0;
            copyElements();
        }
        index += 1;
    }

    function recognize(pixels: number[]) {
        testResult = model.predict(pixels);
    }

</script>
<h1>Logistic Regression</h1>
<div id="logisticReg">
    <ButtonToolbar>
        <ButtonGroup class="me-2">
            <Button color="primary" on:click={() => start()} disabled={started}>Start</Button>
            <Button color="primary" on:click={() => stop()} disabled={!started}>Stop</Button>
            <Button color="primary" on:click={() => reset()} disabled={!started}>Reset</Button>
            <Button color="primary" on:click={() => train()} disabled={started}>Train</Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button color="primary" on:click={() => clear()} disabled={started}>Clear</Button>
        </ButtonGroup>
    </ButtonToolbar>
    <Card class="mt-2">
        <CardBody>
            <ul>
                <li>Cost: {cost}</li>
                <li>Epoch: {epoch}</li>
                <li>Performance: {performance}%</li>
            </ul>
        </CardBody>
    </Card>
    <div class="charts mt-2">
        <div class="element">
            <DigitImage pixels={samples.length > index ? samples[index].pixels : []} width={200} height={200} />
        </div>
        <LineChart data={costs}></LineChart>
        <DrawPanel pixels={testPixels} width={200} height={200} on:draw={e => recognize(e.detail)} />
        <span>{testResult}</span>
    </div>
    <div class="charts mt-2">
        {#each elements as element}
            <DigitImage pixels={element} width={100} height={100} isParam={true} />
        {/each}
    </div>
</div>

<style>
    .charts {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }

    .element {
        align-self: start;
    }
</style>