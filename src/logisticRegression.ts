
// https://github.com/Newmu/Theano-Tutorials

import {InnerProduct, SoftmaxWithLoss, Argmax, Variable, Parameter, SGDOptimizer} from './blocks';
import {MatrixValueFactory} from './matrix'
import {makeTrain, makePredict} from './digitModel';
import type {Model} from './digitModel';

export function buildModel(): Model {
    let vf = new MatrixValueFactory();
    let X = new Variable("X");
    let Y = new Variable("Y");
    let w = new Parameter("w", vf.random(10, 784));

    let soft = new SoftmaxWithLoss(vf, new InnerProduct(X, w), Y);
    var yPred = new Argmax(vf, soft);

    var learningRate = 0.01;
    let optimizer = new SGDOptimizer(learningRate).optimize(soft.cost());
    return {
        params: [w],
        train: makeTrain(vf, soft, optimizer),
        predict: makePredict(vf, yPred)
    };
}

