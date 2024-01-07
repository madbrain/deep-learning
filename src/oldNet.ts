
import {InnerProduct, SoftmaxWithLoss, Argmax, Sigmoid, Variable, Parameter, SGDOptimizer, ExpressionLeaves} from './blocks';
import {MatrixValueFactory} from './matrix'
import {makeTrain, makePredict} from './digitModel';
import type {Model} from './digitModel';

export function buildModel(): Model {
    let vf = new MatrixValueFactory();
    let X = new Variable("X");
    let Y = new Variable("Y");
    let w1 = new Parameter("w1", vf.random(625, 784));
    let w2 = new Parameter("w2", vf.random(10, 625));
    let h1 = new Sigmoid(new InnerProduct(X, w1));
    let soft = new SoftmaxWithLoss(vf, new InnerProduct(h1, w2), Y);
    let yPred = new Argmax(vf, soft);

    let learningRate = 0.01;
    let optimizer = new SGDOptimizer(learningRate).optimize(soft.cost());
    return {
        params: [w1, w2],
        train: makeTrain(vf, soft, optimizer),
        predict: makePredict(vf, yPred)
    };
}