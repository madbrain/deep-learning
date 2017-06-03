
export class MatrixValueFactory {
    public matrix(elements: number[][]) { return new MatrixImpl(elements); }
    public random(height: number, width: number) {
        let newElements = [];
        for (let i = 0; i < height; i++) {
            let line = [];
            for (let j = 0; j < width; j++) {
                line.push(0);
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }
    public constant(value: number) { return new MatrixImpl(value); }
    public oneHot(i: number, size: number): Matrix {
        let elements = [];
        for (let x = 0; x < size; x++) {
            elements.push(x == i ? 1 : 0);
        }
        return this.matrix([elements]);
    }
}

export interface Matrix {
    width(): number;
    height(): number;
    value(): number;
    get(i: number, j: number): number;
    transpose(): Matrix;
    add(other: Matrix): Matrix;
    multiply(other: Matrix): Matrix;
    unitMul(other: Matrix): Matrix;
    subtract(other: Matrix): Matrix;
    equals(other: Matrix): boolean;

    map(func: (number) => number): Matrix;
    log(): Matrix;
    sum(): Matrix;
    neg(): Matrix;
    squared(): Matrix;
    scaled(value: number): Matrix;
}

export class MatrixImpl implements Matrix {
    constructor(private elements: number[][]) {}
    public value() {
        return this.elements[0][0];
    }
    width() { return this.elements[0].length; }
    height() { return this.elements.length; }
    get(i: number, j: number): number { return this.elements[i][j]; }
    equals(other: Matrix) {
        if (other.width() >= 0 && (this.width() != other.width() || this.height() != other.height())) {
            throw new Error("incompatible matrix size");
        }
        for (let i = 0; i < this.width(); i++) {
            for (let j = 0; j < this.height(); j++) {
                if(this.get(j, i) != other.get(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }
    transpose(): Matrix {
        let newElements = [];
        for (let i = 0; i < this.width(); i++) {
            let line = [];
            for (let j = 0; j < this.height(); j++) {
                line.push(this.get(j, i));
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }
    add(other: Matrix): Matrix {
        if (this.width() != other.width() || this.height() != other.height()) {
            throw new Error("incompatible matrix size");
        }
        let newElements = [];
        for (let i = 0; i < this.height(); i++) {
            let line = [];
            for (let j = 0; j < this.width(); j++) {
                line.push(this.get(i, j) + other.get(i, j));
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }
    
    subtract(other: Matrix): Matrix {
        if (this.width() != other.width() || this.height() != other.height()) {
            throw new Error("incompatible matrix size");
        }
        let newElements = [];
        for (let i = 0; i < this.height(); i++) {
            let line = [];
            for (let j = 0; j < this.width(); j++) {
                line.push(this.get(i, j) - other.get(i, j));
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }
    
    unitMul(other: Matrix): Matrix {
        if (this.width() != other.width() || this.height() != other.height()) {
            throw new Error("incompatible matrix size");
        }
        let newElements = [];
        for (let i = 0; i < this.height(); i++) {
            let line = [];
            for (let j = 0; j < this.width(); j++) {
                line.push(this.get(i, j) * other.get(i, j));
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }

    multiply(other: Matrix): Matrix {
        if (other.width() < 0) {
            throw new Error("add constant mul support");
        }
        if (this.width() != other.height()) {
            throw new Error("incompatible matrix size");
        }
        let newElements = [];
        for (let i = 0; i < this.height(); i++) {
            let line = [];
            for (let j = 0; j < other.width(); j++) {
                let sum = 0;
                for (let k = 0; k < this.width(); k++) {
                    sum += this.get(i, k) * other.get(k, j);
                }
                line.push(sum);
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }

    map(func: (number) => number): Matrix {
        let newElements = [];
        for (let i = 0; i < this.height(); i++) {
            let line = [];
            for (let j = 0; j < this.width(); j++) {
                line.push(func(this.get(i, j)));
            }
            newElements.push(line);
        }
        return new MatrixImpl(newElements);
    }

    log(): Matrix {
        return this.map(x => Math.log(x));
    }

    neg(): Matrix {
        return this.map(x => -x);
    }

    sum(): Matrix {
        let sum = 0;
        for (let i = 0; i < this.height(); i++) {
            for (let j = 0; j < this.width(); j++) {
                sum += this.get(i, j);
            }
        }
        return new MatrixImpl([[sum]]);
    }

    squared(): Matrix {
        return this.map(x => x * x);
    }

    scaled(value: number): Matrix {
        return this.map(x => x * value);
    }

}