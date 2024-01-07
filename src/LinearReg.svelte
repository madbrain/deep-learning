
<script lang="ts">
    import { onMount } from 'svelte';
    import { Button, ButtonGroup, ButtonToolbar, Card, CardBody } from '@sveltestrap/sveltestrap';
    import PointRegressionChart from './PointRegressionChart.svelte';
    import LineChart from './LineChart.svelte';
    import * as regression from './linearRegression';
    import { MatrixValueFactory } from './matrix';
    import type {Point} from './point';

    let points: Point[] = regression.createData()
    let model: regression.Model;
    let cost: number;
    let costs: Point[] = [];
    let started = false;
    let epoch = 0;
    let learningRate = 0.01;
    let params = new MatrixValueFactory().matrix([[0, 0]])

    let timer: number;
    let index = 0;

    onMount(() => {
        reset();
    });

    function reset() {
        costs = [];
        model = regression.buildModel(learningRate);
        index = 0;
        epoch = 0;
    }

    function start() {
        started = true;
        model = regression.buildModel(learningRate);
        timer = setInterval(() => {
            cost = regression.trainModel(points.slice(index, index + 5), model);
            params = model.params[0].value;
            index += 5;
            if (index >= points.length) {
                index = 0;
                epoch += 1;
            }
            costs = [...costs, {x: costs.length, y: cost}];
            if (epoch > 5) {
                stop();
            }
        }, 500);
    }

    function stop() {
        if (started) {
            clearInterval(timer);
            started = false;
        }
    }

</script>

<h1>Linear Regression</h1>
<div id="linearReg">
    <ButtonToolbar>
        <ButtonGroup class="me-2">
            <Button color="primary" on:click={() => start()} disabled={started}>Start</Button>
        </ButtonGroup>
        <ButtonGroup class="me-2">
            <Button color="warning" on:click={() => stop()} disabled={!started}>Stop</Button>
        </ButtonGroup>
        <ButtonGroup class="me-2">
            <Button color="secondary" on:click={() => reset()} disabled={started}>Reset</Button>
        </ButtonGroup>
    </ButtonToolbar>
    <Card class="mt-2">
        <CardBody>
            <ul>
                <li>Learning rate: <input bind:value={learningRate}></li>
                <li>W: {params.display()}</li>
                <li>Epoch: {epoch}</li>
                <li>Cost: {cost}</li>
            </ul>
        </CardBody>
    </Card>
    <div class="charts mt-2">
        <PointRegressionChart points={points} params={params} />
        <LineChart data={costs} />
    </div>
</div>

<style>
    .charts {
        display: flex;
        flex-direction: row;
    }
</style>
