
// https://github.com/Newmu/Theano-Tutorials

import {Expression, InnerProduct, SoftmaxWithLoss, Argmax, Variable, Parameter, SGDOptimizer, ExpressionLeaves} from './blocks';
import {MatrixValueFactory, Matrix} from './matrix'
import {Sample, Model, makeTrain, makePredict} from './digitModel';

export function buildModel(): Model {
    let vf = new MatrixValueFactory();
    let X = new Variable("X");
    let Y = new Variable("Y");
    let w = new Parameter("w", vf.random(10, 784));

    let soft = new SoftmaxWithLoss(vf, new InnerProduct(X, w), Y);
    var yPred = new Argmax(vf, soft.result());

    var learningRate = 0.01;
    let optimizer = new SGDOptimizer(learningRate).optimize(soft);
    return {
        params: [w],
        train: makeTrain(vf, soft, optimizer),
        predict: makePredict(vf, yPred)
    };
}

