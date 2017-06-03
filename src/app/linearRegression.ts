
// https://github.com/Newmu/Theano-Tutorials

import {Expression, Variable, Parameter, InnerProduct, EuclideanLoss, SGDOptimizer} from './blocks';
import {MatrixValueFactory, Matrix} from './matrix';
import {Point} from './point';

export function createData(): Point[] {
    var i: number;
    var minX = -1;
    var maxX = 1;
    var elements: Point[] = [];
    for (i = 0; i < 100; ++i) {
        var x = minX + i * (maxX - minX) / 100;
        var y = 2 * x + Math.random() * 1.2;
        elements.push({x: x, y: y});
    }
    return elements;
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

export function buildModel(): Model {
    let vf = new MatrixValueFactory();
    let X = new Variable("X");
    let Y = new Variable("Y");
    let w = new Parameter("w", vf.matrix([[0, 0]]));
    let y = new InnerProduct(X, w);

    // Stochastic Gradient Descent
    var cost = new EuclideanLoss(y, Y);
    var learningRate = 0.01;
    let optimizer = new SGDOptimizer(learningRate).optimize(cost);
    let train = make(vf, cost, optimizer);
    return {params: [w], train: train};
}

export function trainModel(elements: Point[], model: Model) {
    var cost = 0;
    elements.forEach((e) => {
        cost = model.train(e.x, e.y);
    });
    return cost;
}
