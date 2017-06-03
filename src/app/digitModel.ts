
import {Expression, Variable, Parameter} from './blocks';
import {MatrixValueFactory, Matrix} from './matrix'

export interface Sample {
    digit: number;
    pixels: Array<number>;
}

export interface Model {
    params: Parameter[];
    train: (x:number[], y:number) => number;
    predict: (x: number[]) => number;
}

export function prepareSamples(samples: Sample[]) {
    samples.forEach(sample => {
        sample.pixels = sample.pixels.map(pixel => pixel / 255);
    });
    return samples;
}

export function makeTrain(vf: MatrixValueFactory, output: Expression, optimize: () => void): (x: number[], y: number) => number {
    let inputs = output.collectLeaves().inputs();
    return (x, y) => {
        inputs['X'].value = vf.matrix([x]);
        inputs['Y'].value = vf.oneHot(y, 10);
        var r = output.forward();
        optimize();
        return r.value();
    };
}

export function makePredict(vf: MatrixValueFactory, output: Expression): (x: number[]) => number {
    let inputs = output.collectLeaves().inputs();
    return (x) => {
        inputs['X'].value = vf.matrix([x]);
        return output.forward().value();
    };
}

export function testPerformance(model: Model, samples: Sample[]) {
    let correct = 0;
    samples.forEach(sample => {
        if (model.predict(sample.pixels) == sample.digit) {
            correct++;
        }
    });
    return correct / samples.length;
}