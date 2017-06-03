
import {Matrix, MatrixValueFactory} from './matrix';
import {Model} from './linearRegression';

export interface Expression {
    value: Matrix;
    forward(): Matrix;
    backward(diff: Matrix): void;
    collectLeaves(): ExpressionLeaves;
}

export class ExpressionLeaves {
    constructor(public variables: Variable[], public parameters: Parameter[]) {}
    public merge(other: ExpressionLeaves) {
        return new ExpressionLeaves(this.union(this.variables, other.variables), this.union(this.parameters, other.parameters));
    }
    public inputs(): {[key:string]: Variable} {
        let res = {};
        this.variables.forEach(v => {
            res[v.name] = v;
        })
        return res;
    }
    private union<T>(a: T[], b: T[]): T[] {
        let res: T[] = a.slice();
        b.forEach(v => {
            if (res.indexOf(v) < 0) {
                res.push(v);
            }
        })
        return res;
    }
}

export class InnerProduct implements Expression {
    public value: Matrix;
    constructor(private left: Expression, private right: Expression) {}

    public forward() {
        this.value = this.left.forward().multiply(this.right.forward().transpose());
        return this.value;
    }

    public backward(diff: Matrix) {
        // diff has size of result
        // d cost / d x_ij = diff * d output / d x_ij 
        // d output / d left_ij = d(sum left_ik * right_kj) / d left_ij = right_jj
        this.left.backward(diff.multiply(this.right.value));
        this.right.backward(diff.transpose().multiply(this.left.value));
    }

    public collectLeaves() {
        return this.left.collectLeaves().merge(this.right.collectLeaves());
    }
}

export class Sigmoid implements Expression {
    public value: Matrix;
    constructor(private expr: Expression) {}

    public forward() {
        this.value = this.expr.forward().map(x => 1 / (1 + Math.exp(-x)));
        return this.value;
    }

    public backward(diff: Matrix) {
        // d L / dx = diff * d s / d x
        // d s / dx = s * (1 - s)
        this.expr.backward(this.value.unitMul(this.value.map(x => 1 - x)).unitMul(diff));
    }

    public collectLeaves() {
        return this.expr.collectLeaves();
    }
}

export class Variable implements Expression {
    public value: Matrix;
    constructor(public name: string) {}

    public forward() {
        // TODO take value from current iteration values
        return this.value;
    }

    public backward(diff: Matrix) {
        // ignore
    }

    public collectLeaves() {
        return new ExpressionLeaves([this], []);
    }
}

export class Parameter implements Expression {
    public diff: Matrix;
    constructor(public name: string, public value: Matrix) {}

    public forward() {
        return this.value;
    }

    public backward(diff: Matrix) {
        this.diff = diff;
    }

    public collectLeaves() {
        return new ExpressionLeaves([], [this]);
    }
}

export class EuclideanLoss implements Expression {
    public value: Matrix;
    constructor(private test: Expression, private truth: Expression) {}

    public forward() {
        // TODO keep sum to be more general ?
        this.value = this.test.forward().subtract(this.truth.forward()).squared();
        return this.value;
    }

    public backward(diff: Matrix) {
        // d cost / d test = 2 * sum(test - truth)
        // TODO keep sum to be more general ?
        this.test.backward(this.test.value.subtract(this.truth.value).scaled(2));
    }

   public collectLeaves() {
        return this.test.collectLeaves().merge(this.truth.collectLeaves());
    }
}

export class SoftmaxWithLoss implements Expression {
    public value: Matrix;
    public cost: Matrix;
    public constructor(private vf: MatrixValueFactory, public expr: Expression, public truth: Expression) {}

    // e(x_ij) / sum(k) e(x_ik)
    public forward(): Matrix {
        let res = this.expr.forward();
        
        if (res.height() != 1) {
            throw new Error("softmax expr should be line vector");
        }
        let sum = 0;
        let line = [];
        for (let j = 0; j < res.width(); j++) {
            let value = Math.exp(res.get(0, j));
            sum += value;
            line.push(value);    
        }
        for (let j = 0; j < res.width(); j++) {
            line[j] /= sum
        }
        this.value = this.vf.matrix([line]);
        return this.computeCost();    
    }

    private computeCost(): Matrix {
        let trueVal = this.truth.forward();
        let sum = 0;
        for (let i = 0; i < this.value.width(); i++) {
            sum += Math.log(this.value.get(0, i)) * trueVal.get(0, i);
        }
        this.cost = this.vf.matrix([[- sum]]);
        return this.cost;
    }

    public backward(diff: Matrix): void {
        // cce = p_i - y_i
        let line = [];
        for (let j = 0; j < this.value.width(); j++) {
            let value = this.value.get(0, j) - this.truth.value.get(0, j);
            line.push(value);    
        }
        this.expr.backward(this.vf.matrix([line]));
    }

    public collectLeaves(): ExpressionLeaves {
        return this.expr.collectLeaves().merge(this.truth.collectLeaves());
    }

    public result(): Expression {
        return {
            value: this.value,
            forward: () => { this.forward(); return this.value; },
            backward: (diff: Matrix) => { throw new Error("not implemented"); },
            collectLeaves: () => { return this.expr.collectLeaves(); }
        };
    }

}

export class Argmax implements Expression {
    public value: Matrix;
    public constructor(private vf: MatrixValueFactory, public expr: Expression) {}

    public forward(): Matrix {
        let res = this.expr.forward();
        
        if (res.height() != 1) {
            throw new Error("argmax expr should be line vector");
        }
        let max = 0;
        let index = -1;
        for (let j = 0; j < res.width(); j++) {
            let value = res.get(0, j);
            if (index < 0 || value > max) {
                index = j;
                max = value;
            }
        }
        this.value = this.vf.matrix([[index]]);
        return this.value;    
    }

    public backward(diff: Matrix): void {
        throw new Error("not implemented");
    }

    public collectLeaves(): ExpressionLeaves {
        return this.expr.collectLeaves();
    }
}

export class SGDOptimizer {

    constructor(private learningRate: number) {}

    public optimize(expr: Expression): () => void {
        let leaves = expr.collectLeaves();
        return () => {
            expr.backward(null);
            leaves.parameters.forEach(param => {
                param.value = param.value.subtract(param.diff.scaled(this.learningRate));
            });
        }
    }
}