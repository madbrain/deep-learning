
import * as regression from './linearRegression';
import {Point} from './point';

export class LinearRegController {

    public points: Point[];
    public model: regression.Model;
    public cost: number;
    public costs: Point[] = [];
    public started = false;

    private oldCost: number = -1;
    private timer: angular.IPromise<any>;

    static $inject = [ '$interval' ];
    constructor(private $interval: angular.IIntervalService) {
        this.points = regression.createData();
        this.reset();
    }

    public reset() {
        this.costs = [];
        this.model = regression.buildModel();
    }

    public start() {
        this.started = true;
        this.timer = this.$interval(() => {
            this.cost = regression.trainModel(this.points, this.model);
            this.costs.push({x: this.costs.length, y: this.cost});
            if (Math.abs(this.cost - this.oldCost) < 0.00001) {
                this.$interval.cancel(this.timer);
                this.started = false;
            }
            this.oldCost = this.cost;
        }, 500);
    }
}