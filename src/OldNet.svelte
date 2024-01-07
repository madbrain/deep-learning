
<script lang="ts">

    import * as oldNet from './oldNet';
    import type {Point} from './point';
    import { prepareSamples, testPerformance } from './digitModel';
    import type {Sample, Model} from './digitModel';
    import { onMount } from 'svelte';
    import { Button, ButtonGroup, ButtonToolbar, Card, CardBody } from '@sveltestrap/sveltestrap';
    import DigitImage from './DigitImage.svelte';
    import LineChart from './LineChart.svelte';

    let samples: Sample[] = [];
    let tests: Sample[] = [];
    let index = 0;
    let epoch = 0;
    let model: Model;
    let cost: number;
    let costs: Point[] = [];
    let started = false;
    let elements = [];
    let performance = 0;

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
        model = oldNet.buildModel();
        clearInterval(timer);
        started = false;
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
            costs = [...costs, {x: costs.length, y: costSum / costCount} ];
            costSum = 0;
            costCount = 0;
            copyElements();
        }
        index += 1;
    }
</script>

<h1>Old Network</h1>
<div id="oldNet">
    <ButtonToolbar>
        <ButtonGroup>
            <Button color="primary" on:click={start} disabled={started}>Start</Button>
            <Button color="warning" on:click={reset} disabled={!started}>Reset</Button>
            <Button color="success" on:click={train} disabled={started}>Train</Button>
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
            <DigitImage pixels={index < samples.length ? samples[index].pixels : []} width={200} height={200}/>
        </div>
        <LineChart data={costs} />
    </div>
    <!--<div>
        <digit-image pixels="ctrl.elements[0]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[1]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[2]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[3]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[4]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[5]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[6]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[7]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[8]" width="100" height="100" is-param="true"></digit-image>
        <digit-image pixels="ctrl.elements[9]" width="100" height="100" is-param="true"></digit-image>
    </div>-->
</div>

<style>
    .charts {
        display: flex;
        flex-direction: row;
    }
    .element {
        align-self: start;
    }
</style>