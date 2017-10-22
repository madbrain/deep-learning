
import * as regression from './linearRegression';
import {Point} from './point';

export class LinearRegController {

    public points: Point[];
    public model: regression.Model;
    public cost: number;
    public costs: Point[] = [];
    public started = false;
    public epoch = 0;
    public learningRate = 0.01;

    private oldCost: number = -1;
    private timer: angular.IPromise<any>;
    private index = 0;

    static $inject = [ '$interval' ];
    constructor(private $interval: angular.IIntervalService) {
        this.points = regression.createData();
        this.reset();
    }

    public reset() {
        this.costs = [];
        this.model = regression.buildModel(this.learningRate);
        this.index = 0;
        this.epoch = 0;
    }

    public start() {
        this.started = true;
        this.model = regression.buildModel(this.learningRate);
        this.timer = this.$interval(() => {
            this.cost = regression.trainModel(
                this.points.slice(this.index, this.index + 5), this.model);
            this.index += 5;
            if (this.index >= this.points.length) {
                this.index = 0;
                this.epoch += 1;
            }
            this.costs.push({x: this.costs.length, y: this.cost});
            if (this.epoch > 5) {
                this.$interval.cancel(this.timer);
                this.started = false;
            }
            this.oldCost = this.cost;
        }, 500);
    }
}
