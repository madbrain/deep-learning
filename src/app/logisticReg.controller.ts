
import * as logistic from './logisticRegression';
import {Point} from './point';
import {Sample, Model, prepareSamples, testPerformance} from './digitModel';

export class LogisticRegController {

    public samples: Sample[] = [];
    public tests: Sample[] = [];
    public index = 0;
    public epoch = 0;
    public model: Model;
    public cost: number;
    public costs: Point[] = [];
    public started = false;
    public elements = [];
    public performance = 0;
    public testPixels = [];
    public testResult = 0;

    private costSum = 0;
    private costCount = 0;

    private timer: angular.IPromise<any>;

    static $inject = [ '$interval', '$http' ];
    constructor(private $interval: angular.IIntervalService, private $http: angular.IHttpService) {
        this.reset();
        this.$http.get<Sample[]>("data/trainingsamples.json").then((result) => {
            this.samples = prepareSamples(result.data);
        })
        this.$http.get<Sample[]>("data/validationsamples.json").then((result) => {
            this.tests = prepareSamples(result.data);
        });
    }

    public reset() {
        this.costs = [];
        this.model = logistic.buildModel();
        this.stop();
        this.resetDraw();
    }

    public stop() {
        this.$interval.cancel(this.timer);
        this.started = false;
    }

    public resetDraw() {
        this.testPixels = [];
        for (let i = 0; i < 28*28; ++i) {
            this.testPixels.push(0);
        }
    }

    public start() {
        this.started = true;
        this.timer = this.$interval(() => {
            this.train();
            if (this.index >= this.samples.length) {
                if (this.epoch > 25) {
                    this.$interval.cancel(this.timer);
                    this.started = false;
                }
                this.epoch++;
                this.index = 0;
            }
			if ((this.index % 500) == 0) {
                this.performance = testPerformance(this.model, this.tests) * 100;
			}
        }, 10);
    }

    private copyElements() {
        for (let i = 0; i < 10; i++) {
            this.elements[i] = this.model.params[0].value.elements[i];
        }
    }

    public train() {
        let current = this.samples[this.index];
        this.cost = this.model.train(current.pixels, current.digit);
        this.costSum += this.cost;
        this.costCount++;
        if (this.costCount >= 10) {
            this.costs.push({x: this.costs.length, y: this.costSum / this.costCount});
            this.costSum = 0;
            this.costCount = 0;
            this.copyElements();
        }
        this.index += 1;
    }

    public recognize() {
        this.testResult = this.model.predict(this.testPixels);
    }
}
