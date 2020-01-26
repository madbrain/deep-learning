!function(e){function t(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[v][e]}})}function r(e){if("undefined"!=typeof System&&System.isModule?System.isModule(e):"[object Module]"===Object.prototype.toString.call(e))return e;var t={default:e,__useDefault:e};if(e&&e.__esModule)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return new o(t)}function o(e){Object.defineProperty(this,v,{value:e}),Object.keys(e).forEach(t,this)}function n(e){return"@node/"===e.substr(0,6)?c(e,r(m(e.substr(6))),{}):p[e]}function u(e){var t=n(e);if(!t)throw new Error('Module "'+e+'" expected, but not contained in build.');if(t.module)return t.module;var r=t.linkRecord;return i(t,r),a(t,r,[]),t.module}function i(e,t){if(!t.depLoads){t.declare&&d(e,t),t.depLoads=[];for(var r=0;r<t.deps.length;r++){var o=n(t.deps[r]);t.depLoads.push(o),o.linkRecord&&i(o,o.linkRecord);var u=t.setters&&t.setters[r];u&&(u(o.module||o.linkRecord.moduleObj),o.importerSetters.push(u))}return e}}function d(t,r){var o=r.moduleObj,n=t.importerSetters,u=!1,i=r.declare.call(e,function(e,t){if(!u){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;u=!0;for(var i=0;i<n.length;i++)n[i](o);return u=!1,t}},{id:t.key});"function"!=typeof i?(r.setters=i.setters,r.execute=i.execute):(r.setters=[],r.execute=i)}function l(e,t,r){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:r,setters:void 0,execute:void 0,moduleObj:{}}}}function f(e,t,r,o){var n={};return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:void 0,execute:o,executingRequire:r,moduleObj:{default:n,__useDefault:n},setters:void 0}}}function s(e,t,r){return function(o){for(var n=0;n<e.length;n++)if(e[n]===o){var u,i=t[n],d=i.linkRecord;return u=d?-1===r.indexOf(i)?a(i,d,r):d.moduleObj:i.module,"__useDefault"in u?u.__useDefault:u}}}function a(t,r,n){if(n.push(t),t.module)return t.module;var u;if(r.setters){for(var i=0;i<r.deps.length;i++){var d=r.depLoads[i],l=d.linkRecord;l&&-1===n.indexOf(d)&&(u=a(d,l,l.setters?n:[]))}r.execute.call(y)}else{var f={id:t.key},c=r.moduleObj;Object.defineProperty(f,"exports",{configurable:!0,set:function(e){c.default=c.__useDefault=e},get:function(){return c.__useDefault}});var p=s(r.deps,r.depLoads,n);if(!r.executingRequire)for(var i=0;i<r.deps.length;i++)p(r.deps[i]);var v=r.execute.call(e,p,c.__useDefault,f);void 0!==v?c.default=c.__useDefault=v:f.exports!==c.__useDefault&&(c.default=c.__useDefault=f.exports);var m=c.__useDefault;if(m&&m.__esModule)for(var b in m)Object.hasOwnProperty.call(m,b)&&(c[b]=m[b])}var f=t.module=new o(r.moduleObj);if(!r.setters)for(var i=0;i<t.importerSetters.length;i++)t.importerSetters[i](f);return f}function c(e,t){return p[e]={key:e,module:t,importerSetters:[],linkRecord:void 0}}var p={},v="undefined"!=typeof Symbol?Symbol():"@@baseObject";o.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(o.prototype[Symbol.toStringTag]="Module");var m="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,y={};return Object.freeze&&Object.freeze(y),function(e,t,n,i){return function(d){d(function(d){var s={_nodeRequire:m,register:l,registerDynamic:f,registry:{get:function(e){return p[e].module},set:c},newModule:function(e){return new o(e)}};c("@empty",new o({}));for(var a=0;a<t.length;a++)c(t[a],r(arguments[a],{}));i(s);var v=u(e[0]);if(e.length>1)for(var a=1;a<e.length;a++)u(e[a]);return n?v.__useDefault:(v instanceof o&&Object.defineProperty(v,"__esModule",{value:!0}),v)})}}}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this)

(["a"], [], true, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("b", ["c", "d"], true, function ($__require, exports, module) {
    "use strict";
    // https://github.com/Newmu/Theano-Tutorials

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var blocks_1 = $__require("c");
    var matrix_1 = $__require("d");
    function createData() {
        var i;
        var minX = -1;
        var maxX = 1;
        var elements = [];
        for (i = 0; i < 100; ++i) {
            var x = minX + i * (maxX - minX) / 100;
            var y = 2 * x + Math.sin(Math.random()) * 2;
            elements.push({ x: x, y: y });
        }
        shuffle(elements);
        return elements;
    }
    exports.createData = createData;
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }
    function make(vf, output, optimizer) {
        var inputs = output.collectLeaves().inputs();
        return function (x, y) {
            inputs['X'].value = vf.matrix([[x, 1]]);
            inputs['Y'].value = vf.matrix([[y]]);
            var r = output.forward();
            optimizer();
            return r.value();
        };
    }
    function buildModel(learningRate) {
        var vf = new matrix_1.MatrixValueFactory();
        var X = new blocks_1.Variable("X");
        var Y = new blocks_1.Variable("Y");
        var w = new blocks_1.Parameter("w", vf.matrix([[0, 0]]));
        var y = new blocks_1.InnerProduct(X, w);
        // Stochastic Gradient Descent
        var cost = new blocks_1.EuclideanLoss(y, Y);
        var optimizer = new blocks_1.SGDOptimizer(learningRate).optimize(cost);
        var train = make(vf, cost, optimizer);
        return { params: [w], train: train };
    }
    exports.buildModel = buildModel;
    function trainModel(elements, model) {
        var cost = 0;
        elements.forEach(function (e) {
            cost += model.train(e.x, e.y);
        });
        return cost / elements.length;
    }
    exports.trainModel = trainModel;
});
$__System.registerDynamic("e", ["b"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var regression = $__require("b");
    var LinearRegController = /** @class */function () {
        function LinearRegController($interval) {
            this.$interval = $interval;
            this.costs = [];
            this.started = false;
            this.epoch = 0;
            this.learningRate = 0.01;
            this.oldCost = -1;
            this.index = 0;
            this.points = regression.createData();
            this.reset();
        }
        LinearRegController.prototype.reset = function () {
            this.costs = [];
            this.model = regression.buildModel(this.learningRate);
            this.index = 0;
            this.epoch = 0;
        };
        LinearRegController.prototype.start = function () {
            var _this = this;
            this.started = true;
            this.model = regression.buildModel(this.learningRate);
            this.timer = this.$interval(function () {
                _this.cost = regression.trainModel(_this.points.slice(_this.index, _this.index + 5), _this.model);
                _this.index += 5;
                if (_this.index >= _this.points.length) {
                    _this.index = 0;
                    _this.epoch += 1;
                }
                _this.costs.push({ x: _this.costs.length, y: _this.cost });
                if (_this.epoch > 5) {
                    _this.$interval.cancel(_this.timer);
                    _this.started = false;
                }
                _this.oldCost = _this.cost;
            }, 500);
        };
        LinearRegController.$inject = ['$interval'];
        return LinearRegController;
    }();
    exports.LinearRegController = LinearRegController;
});
$__System.registerDynamic("f", ["c", "d", "10"], true, function ($__require, exports, module) {
    "use strict";
    // https://github.com/Newmu/Theano-Tutorials

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var blocks_1 = $__require("c");
    var matrix_1 = $__require("d");
    var digitModel_1 = $__require("10");
    function buildModel() {
        var vf = new matrix_1.MatrixValueFactory();
        var X = new blocks_1.Variable("X");
        var Y = new blocks_1.Variable("Y");
        var w = new blocks_1.Parameter("w", vf.random(10, 784));
        var soft = new blocks_1.SoftmaxWithLoss(vf, new blocks_1.InnerProduct(X, w), Y);
        var yPred = new blocks_1.Argmax(vf, soft);
        var learningRate = 0.01;
        var optimizer = new blocks_1.SGDOptimizer(learningRate).optimize(soft.cost());
        return {
            params: [w],
            train: digitModel_1.makeTrain(vf, soft, optimizer),
            predict: digitModel_1.makePredict(vf, yPred)
        };
    }
    exports.buildModel = buildModel;
});
$__System.registerDynamic("11", ["f", "10"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var logistic = $__require("f");
    var digitModel_1 = $__require("10");
    var LogisticRegController = /** @class */function () {
        function LogisticRegController($interval, $http) {
            var _this = this;
            this.$interval = $interval;
            this.$http = $http;
            this.samples = [];
            this.tests = [];
            this.index = 0;
            this.epoch = 0;
            this.costs = [];
            this.started = false;
            this.elements = [];
            this.performance = 0;
            this.testPixels = [];
            this.testResult = 0;
            this.costSum = 0;
            this.costCount = 0;
            this.reset();
            this.$http.get("data/trainingsamples.json").then(function (result) {
                _this.samples = digitModel_1.prepareSamples(result.data);
            });
            this.$http.get("data/validationsamples.json").then(function (result) {
                _this.tests = digitModel_1.prepareSamples(result.data);
            });
        }
        LogisticRegController.prototype.reset = function () {
            this.costs = [];
            this.model = logistic.buildModel();
            this.stop();
            this.resetDraw();
        };
        LogisticRegController.prototype.stop = function () {
            this.$interval.cancel(this.timer);
            this.started = false;
        };
        LogisticRegController.prototype.resetDraw = function () {
            this.testPixels = [];
            for (var i = 0; i < 28 * 28; ++i) {
                this.testPixels.push(0);
            }
        };
        LogisticRegController.prototype.start = function () {
            var _this = this;
            this.started = true;
            this.timer = this.$interval(function () {
                _this.train();
                if (_this.index >= _this.samples.length) {
                    if (_this.epoch > 25) {
                        _this.$interval.cancel(_this.timer);
                        _this.started = false;
                    }
                    _this.epoch++;
                    _this.index = 0;
                }
                if (_this.index % 500 == 0) {
                    _this.performance = digitModel_1.testPerformance(_this.model, _this.tests) * 100;
                }
            }, 10);
        };
        LogisticRegController.prototype.copyElements = function () {
            for (var i = 0; i < 10; i++) {
                this.elements[i] = this.model.params[0].value.elements[i];
            }
        };
        LogisticRegController.prototype.train = function () {
            var current = this.samples[this.index];
            this.cost = this.model.train(current.pixels, current.digit);
            this.costSum += this.cost;
            this.costCount++;
            if (this.costCount >= 10) {
                this.costs.push({ x: this.costs.length, y: this.costSum / this.costCount });
                this.costSum = 0;
                this.costCount = 0;
                this.copyElements();
            }
            this.index += 1;
        };
        LogisticRegController.prototype.recognize = function () {
            this.testResult = this.model.predict(this.testPixels);
        };
        LogisticRegController.$inject = ['$interval', '$http'];
        return LogisticRegController;
    }();
    exports.LogisticRegController = LogisticRegController;
});
$__System.registerDynamic("c", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExpressionLeaves = /** @class */function () {
        function ExpressionLeaves(variables, parameters) {
            this.variables = variables;
            this.parameters = parameters;
        }
        ExpressionLeaves.prototype.merge = function (other) {
            return new ExpressionLeaves(this.union(this.variables, other.variables), this.union(this.parameters, other.parameters));
        };
        ExpressionLeaves.prototype.inputs = function () {
            var res = {};
            this.variables.forEach(function (v) {
                res[v.name] = v;
            });
            return res;
        };
        ExpressionLeaves.prototype.union = function (a, b) {
            var res = a.slice();
            b.forEach(function (v) {
                if (res.indexOf(v) < 0) {
                    res.push(v);
                }
            });
            return res;
        };
        return ExpressionLeaves;
    }();
    exports.ExpressionLeaves = ExpressionLeaves;
    var InnerProduct = /** @class */function () {
        function InnerProduct(left, right) {
            this.left = left;
            this.right = right;
        }
        InnerProduct.prototype.forward = function () {
            this.value = this.left.forward().multiply(this.right.forward().transpose());
            return this.value;
        };
        InnerProduct.prototype.backward = function (diff) {
            // diff has size of result
            // d cost / d x_ij = diff * d output / d x_ij 
            // d output / d left_ij = d(sum left_ik * right_kj) / d left_ij = right_jj
            this.left.backward(diff.multiply(this.right.value));
            this.right.backward(diff.transpose().multiply(this.left.value));
        };
        InnerProduct.prototype.collectLeaves = function () {
            return this.left.collectLeaves().merge(this.right.collectLeaves());
        };
        return InnerProduct;
    }();
    exports.InnerProduct = InnerProduct;
    var Sigmoid = /** @class */function () {
        function Sigmoid(expr) {
            this.expr = expr;
        }
        Sigmoid.prototype.forward = function () {
            this.value = this.expr.forward().map(function (x) {
                return 1 / (1 + Math.exp(-x));
            });
            return this.value;
        };
        Sigmoid.prototype.backward = function (diff) {
            // d L / dx = diff * d s / d x
            // d s / dx = s * (1 - s)
            this.expr.backward(this.value.unitMul(this.value.map(function (x) {
                return 1 - x;
            })).unitMul(diff));
        };
        Sigmoid.prototype.collectLeaves = function () {
            return this.expr.collectLeaves();
        };
        return Sigmoid;
    }();
    exports.Sigmoid = Sigmoid;
    var Variable = /** @class */function () {
        function Variable(name) {
            this.name = name;
        }
        Variable.prototype.forward = function () {
            // TODO take value from current iteration values
            return this.value;
        };
        Variable.prototype.backward = function (diff) {
            // ignore
        };
        Variable.prototype.collectLeaves = function () {
            return new ExpressionLeaves([this], []);
        };
        return Variable;
    }();
    exports.Variable = Variable;
    var Parameter = /** @class */function () {
        function Parameter(name, value) {
            this.name = name;
            this.value = value;
        }
        Parameter.prototype.forward = function () {
            return this.value;
        };
        Parameter.prototype.backward = function (diff) {
            this.diff = diff;
        };
        Parameter.prototype.collectLeaves = function () {
            return new ExpressionLeaves([], [this]);
        };
        return Parameter;
    }();
    exports.Parameter = Parameter;
    var EuclideanLoss = /** @class */function () {
        function EuclideanLoss(test, truth) {
            this.test = test;
            this.truth = truth;
        }
        EuclideanLoss.prototype.forward = function () {
            // TODO keep sum to be more general ?
            this.value = this.test.forward().subtract(this.truth.forward()).squared();
            return this.value;
        };
        EuclideanLoss.prototype.backward = function (diff) {
            // d cost / d test = 2 * sum(test - truth)
            // TODO keep sum to be more general ?
            this.test.backward(this.test.value.subtract(this.truth.value).scaled(2));
        };
        EuclideanLoss.prototype.collectLeaves = function () {
            return this.test.collectLeaves().merge(this.truth.collectLeaves());
        };
        return EuclideanLoss;
    }();
    exports.EuclideanLoss = EuclideanLoss;
    var SoftmaxWithLoss = /** @class */function () {
        function SoftmaxWithLoss(vf, expr, truth) {
            this.vf = vf;
            this.expr = expr;
            this.truth = truth;
        }
        // e(x_ij) / sum(k) e(x_ik)
        SoftmaxWithLoss.prototype.forward = function () {
            var res = this.expr.forward();
            if (res.height() != 1) {
                throw new Error("softmax expr should be line vector");
            }
            var sum = 0;
            var line = [];
            for (var j = 0; j < res.width(); j++) {
                var value = Math.exp(res.get(0, j));
                sum += value;
                line.push(value);
            }
            for (var j = 0; j < res.width(); j++) {
                line[j] /= sum;
            }
            this.value = this.vf.matrix([line]);
            return this.value;
        };
        SoftmaxWithLoss.prototype.computeCost = function () {
            var trueVal = this.truth.forward();
            var sum = 0;
            for (var i = 0; i < this.value.width(); i++) {
                sum += Math.log(this.value.get(0, i)) * trueVal.get(0, i);
            }
            this.costs = this.vf.matrix([[-sum]]);
            return this.costs;
        };
        SoftmaxWithLoss.prototype.backward = function (diff) {
            // cce = p_i - y_i
            var line = [];
            for (var j = 0; j < this.value.width(); j++) {
                var value = this.value.get(0, j) - this.truth.value.get(0, j);
                line.push(value);
            }
            this.expr.backward(this.vf.matrix([line]));
        };
        SoftmaxWithLoss.prototype.collectLeaves = function () {
            return this.expr.collectLeaves().merge(this.truth.collectLeaves());
        };
        SoftmaxWithLoss.prototype.cost = function () {
            var _this = this;
            return {
                value: this.value,
                forward: function () {
                    _this.forward();return _this.computeCost();
                },
                backward: function (diff) {
                    _this.backward(diff);
                },
                collectLeaves: function () {
                    return _this.expr.collectLeaves();
                }
            };
        };
        return SoftmaxWithLoss;
    }();
    exports.SoftmaxWithLoss = SoftmaxWithLoss;
    var Argmax = /** @class */function () {
        function Argmax(vf, expr) {
            this.vf = vf;
            this.expr = expr;
        }
        Argmax.prototype.forward = function () {
            var res = this.expr.forward();
            if (res.height() != 1) {
                throw new Error("argmax expr should be line vector");
            }
            var max = 0;
            var index = -1;
            for (var j = 0; j < res.width(); j++) {
                var value = res.get(0, j);
                if (index < 0 || value > max) {
                    index = j;
                    max = value;
                }
            }
            this.value = this.vf.matrix([[index]]);
            return this.value;
        };
        Argmax.prototype.backward = function (diff) {
            throw new Error("not implemented");
        };
        Argmax.prototype.collectLeaves = function () {
            return this.expr.collectLeaves();
        };
        return Argmax;
    }();
    exports.Argmax = Argmax;
    var SGDOptimizer = /** @class */function () {
        function SGDOptimizer(learningRate) {
            this.learningRate = learningRate;
        }
        SGDOptimizer.prototype.optimize = function (expr) {
            var _this = this;
            var leaves = expr.collectLeaves();
            return function () {
                expr.backward(null);
                leaves.parameters.forEach(function (param) {
                    param.value = param.value.subtract(param.diff.scaled(_this.learningRate));
                });
            };
        };
        return SGDOptimizer;
    }();
    exports.SGDOptimizer = SGDOptimizer;
});
$__System.registerDynamic("d", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var MatrixValueFactory = /** @class */function () {
        function MatrixValueFactory() {}
        MatrixValueFactory.prototype.matrix = function (elements) {
            return new MatrixImpl(elements);
        };
        MatrixValueFactory.prototype.random = function (height, width) {
            var newElements = [];
            for (var i = 0; i < height; i++) {
                var line = [];
                for (var j = 0; j < width; j++) {
                    line.push(0);
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixValueFactory.prototype.constant = function (value) {
            return new MatrixImpl(value);
        };
        MatrixValueFactory.prototype.oneHot = function (i, size) {
            var elements = [];
            for (var x = 0; x < size; x++) {
                elements.push(x == i ? 1 : 0);
            }
            return this.matrix([elements]);
        };
        return MatrixValueFactory;
    }();
    exports.MatrixValueFactory = MatrixValueFactory;
    var MatrixImpl = /** @class */function () {
        function MatrixImpl(elements) {
            this.elements = elements;
        }
        MatrixImpl.prototype.value = function () {
            return this.elements[0][0];
        };
        MatrixImpl.prototype.width = function () {
            return this.elements[0].length;
        };
        MatrixImpl.prototype.height = function () {
            return this.elements.length;
        };
        MatrixImpl.prototype.get = function (i, j) {
            return this.elements[i][j];
        };
        MatrixImpl.prototype.equals = function (other) {
            if (other.width() >= 0 && (this.width() != other.width() || this.height() != other.height())) {
                throw new Error("incompatible matrix size");
            }
            for (var i = 0; i < this.width(); i++) {
                for (var j = 0; j < this.height(); j++) {
                    if (this.get(j, i) != other.get(i, j)) {
                        return false;
                    }
                }
            }
            return true;
        };
        MatrixImpl.prototype.transpose = function () {
            var newElements = [];
            for (var i = 0; i < this.width(); i++) {
                var line = [];
                for (var j = 0; j < this.height(); j++) {
                    line.push(this.get(j, i));
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.add = function (other) {
            if (this.width() != other.width() || this.height() != other.height()) {
                throw new Error("incompatible matrix size");
            }
            var newElements = [];
            for (var i = 0; i < this.height(); i++) {
                var line = [];
                for (var j = 0; j < this.width(); j++) {
                    line.push(this.get(i, j) + other.get(i, j));
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.subtract = function (other) {
            if (this.width() != other.width() || this.height() != other.height()) {
                throw new Error("incompatible matrix size");
            }
            var newElements = [];
            for (var i = 0; i < this.height(); i++) {
                var line = [];
                for (var j = 0; j < this.width(); j++) {
                    line.push(this.get(i, j) - other.get(i, j));
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.unitMul = function (other) {
            if (this.width() != other.width() || this.height() != other.height()) {
                throw new Error("incompatible matrix size");
            }
            var newElements = [];
            for (var i = 0; i < this.height(); i++) {
                var line = [];
                for (var j = 0; j < this.width(); j++) {
                    line.push(this.get(i, j) * other.get(i, j));
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.multiply = function (other) {
            if (other.width() < 0) {
                throw new Error("add constant mul support");
            }
            if (this.width() != other.height()) {
                throw new Error("incompatible matrix size");
            }
            var newElements = [];
            for (var i = 0; i < this.height(); i++) {
                var line = [];
                for (var j = 0; j < other.width(); j++) {
                    var sum = 0;
                    for (var k = 0; k < this.width(); k++) {
                        sum += this.get(i, k) * other.get(k, j);
                    }
                    line.push(sum);
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.map = function (func) {
            var newElements = [];
            for (var i = 0; i < this.height(); i++) {
                var line = [];
                for (var j = 0; j < this.width(); j++) {
                    line.push(func(this.get(i, j)));
                }
                newElements.push(line);
            }
            return new MatrixImpl(newElements);
        };
        MatrixImpl.prototype.log = function () {
            return this.map(function (x) {
                return Math.log(x);
            });
        };
        MatrixImpl.prototype.neg = function () {
            return this.map(function (x) {
                return -x;
            });
        };
        MatrixImpl.prototype.sum = function () {
            var sum = 0;
            for (var i = 0; i < this.height(); i++) {
                for (var j = 0; j < this.width(); j++) {
                    sum += this.get(i, j);
                }
            }
            return new MatrixImpl([[sum]]);
        };
        MatrixImpl.prototype.squared = function () {
            return this.map(function (x) {
                return x * x;
            });
        };
        MatrixImpl.prototype.scaled = function (value) {
            return this.map(function (x) {
                return x * value;
            });
        };
        return MatrixImpl;
    }();
    exports.MatrixImpl = MatrixImpl;
});
$__System.registerDynamic("12", ["c", "d", "10"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var blocks_1 = $__require("c");
    var matrix_1 = $__require("d");
    var digitModel_1 = $__require("10");
    function buildModel() {
        var vf = new matrix_1.MatrixValueFactory();
        var X = new blocks_1.Variable("X");
        var Y = new blocks_1.Variable("Y");
        var w1 = new blocks_1.Parameter("w1", vf.random(625, 784));
        var w2 = new blocks_1.Parameter("w2", vf.random(10, 625));
        var h1 = new blocks_1.Sigmoid(new blocks_1.InnerProduct(X, w1));
        var soft = new blocks_1.SoftmaxWithLoss(vf, new blocks_1.InnerProduct(h1, w2), Y);
        var yPred = new blocks_1.Argmax(vf, soft);
        var learningRate = 0.01;
        var optimizer = new blocks_1.SGDOptimizer(learningRate).optimize(soft.cost());
        return {
            params: [w1, w2],
            train: digitModel_1.makeTrain(vf, soft, optimizer),
            predict: digitModel_1.makePredict(vf, yPred)
        };
    }
    exports.buildModel = buildModel;
});
$__System.registerDynamic("10", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function prepareSamples(samples) {
        samples.forEach(function (sample) {
            sample.pixels = sample.pixels.map(function (pixel) {
                return pixel / 255;
            });
        });
        return samples;
    }
    exports.prepareSamples = prepareSamples;
    function makeTrain(vf, output, optimize) {
        var inputs = output.collectLeaves().inputs();
        return function (x, y) {
            inputs['X'].value = vf.matrix([x]);
            inputs['Y'].value = vf.oneHot(y, 10);
            var r = output.forward();
            optimize();
            return r.value();
        };
    }
    exports.makeTrain = makeTrain;
    function makePredict(vf, output) {
        var inputs = output.collectLeaves().inputs();
        return function (x) {
            inputs['X'].value = vf.matrix([x]);
            return output.forward().value();
        };
    }
    exports.makePredict = makePredict;
    function testPerformance(model, samples) {
        var correct = 0;
        samples.forEach(function (sample) {
            if (model.predict(sample.pixels) == sample.digit) {
                correct++;
            }
        });
        return correct / samples.length;
    }
    exports.testPerformance = testPerformance;
});
$__System.registerDynamic("13", ["12", "10"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var oldNet = $__require("12");
    var digitModel_1 = $__require("10");
    var OldNetController = /** @class */function () {
        function OldNetController($interval, $http) {
            var _this = this;
            this.$interval = $interval;
            this.$http = $http;
            this.samples = [];
            this.tests = [];
            this.index = 0;
            this.epoch = 0;
            this.costs = [];
            this.started = false;
            this.elements = [];
            this.performance = 0;
            this.costSum = 0;
            this.costCount = 0;
            this.reset();
            this.$http.get("data/trainingsamples.json").then(function (result) {
                _this.samples = digitModel_1.prepareSamples(result.data);
            });
            this.$http.get("data/validationsamples.json").then(function (result) {
                _this.tests = digitModel_1.prepareSamples(result.data);
            });
        }
        OldNetController.prototype.reset = function () {
            this.costs = [];
            this.model = oldNet.buildModel();
            this.$interval.cancel(this.timer);
            this.started = false;
        };
        OldNetController.prototype.start = function () {
            var _this = this;
            this.started = true;
            this.timer = this.$interval(function () {
                _this.train();
                if (_this.index >= _this.samples.length) {
                    if (_this.epoch > 25) {
                        _this.$interval.cancel(_this.timer);
                        _this.started = false;
                    }
                    _this.epoch++;
                    _this.index = 0;
                    _this.performance = digitModel_1.testPerformance(_this.model, _this.tests) * 100;
                }
            }, 10);
        };
        OldNetController.prototype.copyElements = function () {
            for (var i = 0; i < 10; i++) {
                this.elements[i] = this.model.params[0].value.elements[i];
            }
        };
        OldNetController.prototype.train = function () {
            var current = this.samples[this.index];
            this.cost = this.model.train(current.pixels, current.digit);
            this.costSum += this.cost;
            this.costCount++;
            if (this.costCount >= 10) {
                this.costs.push({ x: this.costs.length, y: this.costSum / this.costCount });
                this.costSum = 0;
                this.costCount = 0;
                this.copyElements();
            }
            this.index += 1;
        };
        OldNetController.$inject = ['$interval', '$http'];
        return OldNetController;
    }();
    exports.OldNetController = OldNetController;
});
$__System.registerDynamic("14", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineChartDirective = /** @class */function () {
        function LineChartDirective() {
            this.restrict = "EA";
            this.scope = {
                chartData: "="
            };
            LineChartDirective.prototype.link = function (scope, element, attrs) {
                var chartData = [];
                var margin = { top: 20, right: 20, bottom: 30, left: 40 };
                var width = 400;
                var height = 400;
                var xAxis, xScale, yAxis, yScale;
                function computeAxis() {
                    var maxX = d3.max(chartData, function (d) {
                        return d.x;
                    });
                    var maxY = d3.max(chartData, function (d) {
                        return d.y;
                    });
                    xScale = d3.scale.linear().range([0, width]).domain([0, maxX]);
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                    yScale = d3.scale.linear().range([height, 0]).domain([0, maxY]);
                    yAxis = d3.svg.axis().scale(yScale).orient("left");
                }
                computeAxis();
                var svg = d3.select(element.get(0)).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis);
                var lineFun = d3.svg.line().x(function (d) {
                    return xScale(d.x);
                }).y(function (d) {
                    return yScale(d.y);
                });
                svg.append("path").attr("class", "cost").attr("d", lineFun(chartData)).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 2);
                scope.$watchCollection("chartData", function (newVal, oldVal) {
                    chartData = newVal;
                    computeAxis();
                    svg.selectAll("g.x.axis").call(xAxis);
                    svg.selectAll("g.y.axis").call(yAxis);
                    svg.selectAll(".cost").attr({ d: lineFun(chartData) });
                });
            };
        }
        LineChartDirective.Factory = function () {
            var directive = function () {
                return new LineChartDirective();
            };
            directive['$inject'] = [];
            return directive;
        };
        return LineChartDirective;
    }();
    exports.LineChartDirective = LineChartDirective;
});
$__System.registerDynamic("15", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var PointRegChartDirective = /** @class */function () {
        function PointRegChartDirective() {
            this.restrict = "EA";
            this.scope = {
                points: "=",
                params: "="
            };
            PointRegChartDirective.prototype.link = function (scope, element, attrs) {
                var points = scope.points;
                var params = scope.params[0].value;
                var margin = { top: 20, right: 20, bottom: 30, left: 40 };
                var width = 400;
                var height = 400;
                var xValue = function (d) {
                    return d.x;
                };
                var xScale = d3.scale.linear().range([0, width]).domain([-1.2, 1.2]);
                var xMap = function (d) {
                    return xScale(xValue(d));
                };
                var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                var yValue = function (d) {
                    return d.y;
                };
                var yScale = d3.scale.linear().range([height, 0]).domain([-3, 3]);
                var yMap = function (d) {
                    return yScale(yValue(d));
                };
                var yAxis = d3.svg.axis().scale(yScale).orient("left");
                var svg = d3.select("div#linearReg").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis);
                svg.selectAll(".dot").data(points).enter().append("circle").attr("r", 3.5).attr("cx", xMap).attr("cy", yMap).style("fill", "blue");
                var lineFun = d3.svg.line().x(function (d) {
                    return xScale(d.x);
                }).y(function (d) {
                    return yScale(d.y);
                });
                var lineData = [{ x: -1, y: -1 * params.get(0, 0) + params.get(0, 1) }, { x: 1, y: 1 * params.get(0, 0) + params.get(0, 1) }];
                svg.append("path").attr("class", "line").attr("d", lineFun(lineData)).attr("stroke", "red").attr("stroke-width", 2);
                scope.$watch("params", function (newVal, oldVal) {
                    params = newVal[0].value;
                    var lineData = [{ x: -1, y: -1 * params.get(0, 0) + params.get(0, 1) }, { x: 1, y: 1 * params.get(0, 0) + params.get(0, 1) }];
                    svg.transition().select(".line").duration(750).attr("d", lineFun(lineData));
                }, true);
            };
        }
        PointRegChartDirective.Factory = function () {
            var directive = function () {
                return new PointRegChartDirective();
            };
            directive['$inject'] = [];
            return directive;
        };
        return PointRegChartDirective;
    }();
    exports.PointRegChartDirective = PointRegChartDirective;
});
$__System.registerDynamic("16", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var DigitImageDirective = /** @class */function () {
        function DigitImageDirective() {
            this.restrict = "EA";
            this.template = "<canvas style='border:1px solid black' width='{{width}}' height='{{height}}'></canvas>";
            this.scope = {
                width: '@',
                height: '@',
                isParam: '@',
                pixels: '='
            };
            DigitImageDirective.prototype.link = function (scope, element, attrs) {
                var pixels = [];
                var xStep = scope.width / 28;
                var yStep = scope.height / 28;
                var isParam = scope.isParam === undefined ? false : scope.isParam;
                var canvas = element.find("canvas")[0];
                var ctxt = canvas.getContext("2d");
                function redraw() {
                    for (var y = 0; y < 28; y++) {
                        for (var x = 0; x < 28; x++) {
                            var index = y * 28 + x;
                            var grey = Math.floor(isParam ? 127 + Math.max(-127, Math.min(127, pixels[index] * 500)) : 255 * (1 - pixels[index]));
                            ctxt.fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")";
                            ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                        }
                    }
                }
                scope.$watchCollection('pixels', function (newVal, oldVal) {
                    pixels = newVal;
                    if (pixels) {
                        redraw();
                    }
                });
            };
        }
        DigitImageDirective.Factory = function () {
            var directive = function () {
                return new DigitImageDirective();
            };
            directive['$inject'] = [];
            return directive;
        };
        return DigitImageDirective;
    }();
    exports.DigitImageDirective = DigitImageDirective;
});
$__System.registerDynamic("17", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawPanelDirective = /** @class */function () {
        function DrawPanelDirective() {
            this.restrict = "EA";
            this.template = "<canvas style='border:1px solid black' width='{{width}}' height='{{height}}'></canvas>";
            this.scope = {
                width: '@',
                height: '@',
                pixels: '=',
                onDraw: '&'
            };
            DrawPanelDirective.prototype.link = function (scope, element, attrs) {
                var xStep = scope.width / 28;
                var yStep = scope.height / 28;
                var isParam = scope.isParam === undefined ? false : scope.isParam;
                var canvas = element.find("canvas")[0];
                var ctxt = canvas.getContext("2d");
                var pixels = [];
                var isDrawing = false;
                function drawPixel(x, y) {
                    if (x >= 0 && x < 28 && y >= 0 && y < 28) {
                        var index = x + y * 28;
                        pixels[index] = 1;
                        redraw();
                    }
                }
                element.bind('mousedown', function (event) {
                    isDrawing = true;
                });
                element.bind('mouseup', function (event) {
                    isDrawing = false;
                    scope.$apply(function () {
                        scope.onDraw();
                    });
                });
                element.bind('mousemove', function (event) {
                    if (isDrawing) {
                        var x = Math.floor(event.offsetX / xStep);
                        var y = Math.floor(event.offsetY / yStep);
                        for (var dx = -1; dx < 1; ++dx) {
                            for (var dy = -1; dy < 1; ++dy) {
                                drawPixel(x + dx, y + dy);
                            }
                        }
                    }
                });
                function redraw() {
                    for (var y = 0; y < 28; y++) {
                        for (var x = 0; x < 28; x++) {
                            var index = y * 28 + x;
                            var grey = Math.floor(255 * (1 - pixels[index]));
                            ctxt.fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")";
                            ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                        }
                    }
                }
                scope.$watch('pixels', function (newVal, oldVal) {
                    pixels = newVal;
                    if (pixels) {
                        redraw();
                    }
                });
            };
        }
        DrawPanelDirective.Factory = function () {
            var directive = function () {
                return new DrawPanelDirective();
            };
            directive['$inject'] = [];
            return directive;
        };
        return DrawPanelDirective;
    }();
    exports.DrawPanelDirective = DrawPanelDirective;
});
$__System.registerDynamic("18", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderController = /** @class */function () {
        function HeaderController($location) {
            this.$location = $location;
        }
        HeaderController.prototype.isActive = function (viewLocation) {
            return viewLocation === this.$location.path();
        };
        ;
        return HeaderController;
    }();
    exports.HeaderController = HeaderController;
});
$__System.registerDynamic("a", ["e", "11", "13", "14", "15", "16", "17", "18"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var linearReg_controller_1 = $__require("e");
    var logisticReg_controller_1 = $__require("11");
    var oldNet_controller_1 = $__require("13");
    var linechart_directive_1 = $__require("14");
    var pointreg_directive_1 = $__require("15");
    var digitimage_directive_1 = $__require("16");
    var drawPanel_directive_1 = $__require("17");
    var header_controller_1 = $__require("18");
    angular.module('app', ["ngRoute"]).config(function ($routeProvider) {
        $routeProvider.when("/linearReg", {
            templateUrl: "views/linearReg.html",
            controller: linearReg_controller_1.LinearRegController,
            controllerAs: 'ctrl'
        }).when("/logisticReg", {
            templateUrl: "views/logisticReg.html",
            controller: logisticReg_controller_1.LogisticRegController,
            controllerAs: 'ctrl'
        }).when("/oldNet", {
            templateUrl: "views/oldNet.html",
            controller: oldNet_controller_1.OldNetController,
            controllerAs: 'ctrl'
        }).otherwise("/linearReg");
    }).controller('HeaderController', header_controller_1.HeaderController).directive('pointRegressionChart', pointreg_directive_1.PointRegChartDirective.Factory()).directive('lineChart', linechart_directive_1.LineChartDirective.Factory()).directive('digitImage', digitimage_directive_1.DigitImageDirective.Factory()).directive('drawPanel', drawPanel_directive_1.DrawPanelDirective.Factory());
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    factory();
});