
// https://github.com/Newmu/Theano-Tutorials

import {Variable, Parameter, InnerProduct, EuclideanLoss, SGDOptimizer} from './blocks';
import type {Expression} from './blocks';
import {MatrixValueFactory} from './matrix';
import type {Matrix} from './matrix';
import type {Point} from './point';

export function createData(): Point[] {
    var i: number;
    var minX = -1;
    var maxX = 1;
    var elements: Point[] = [];
    for (i = 0; i < 100; ++i) {
        var x = minX + i * (maxX - minX) / 100;
        var y = 2 * x + Math.sin(Math.random()) * 2;
        elements.push({x: x, y: y});
    }
    shuffle(elements);
    return elements;
}

function shuffle(a: any[]) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

export interface Model {
    params: {value: Matrix}[];
    train: (x:number, y:number) => number;
}

function make(vf: MatrixValueFactory, output: Expression, optimizer: () => void): (x: number, y: number) => number {
    let inputs = output.collectLeaves().inputs();
    return (x, y) => {
        inputs['X'].value = vf.matrix([[x, 1]]);
        inputs['Y'].value = vf.matrix([[y]]);
        var r = output.forward();
        optimizer();
        return r.value();
    };
}

export function buildModel(learningRate: number): Model {
    let vf = new MatrixValueFactory();
    let X = new Variable("X");
    let Y = new Variable("Y");
    let w = new Parameter("w", vf.matrix([[0, 0]]));
    let y = new InnerProduct(X, w);

    // Stochastic Gradient Descent
    var cost = new EuclideanLoss(y, Y);
    let optimizer = new SGDOptimizer(learningRate).optimize(cost);
    let train = make(vf, cost, optimizer);
    return {params: [w], train: train};
}

export function trainModel(elements: Point[], model: Model) {
    var cost = 0;
    elements.forEach((e) => {
        cost += model.train(e.x, e.y);
    });
    return cost / elements.length;
}
