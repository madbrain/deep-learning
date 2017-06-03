
interface DigitImageScope extends ng.IScope {
    width: number;
    height: number;
    isParam: boolean;
    pixels: Array<number>;
}

export class DigitImageDirective {

    public restrict = "EA";
    public template = "<canvas style='border:1px solid black' width='{{width}}' height='{{height}}'></canvas>";
    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    public scope = {
        width: '@',
        height: '@',
        isParam: '@',
        pixels: '='
    };

    constructor() {
        DigitImageDirective.prototype.link = (scope: DigitImageScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var pixels = [];
            var xStep = scope.width / 28;
            var yStep = scope.height / 28;
            var isParam = scope.isParam === undefined ? false : scope.isParam;
            var canvas = <HTMLCanvasElement>element.find("canvas")[0];
            var ctxt = canvas.getContext("2d");

            function redraw() {
                for (var y = 0; y < 28; y++) {
                    for (var x = 0; x < 28; x++) {
                        var index = y*28+x;
                        var grey = Math.floor(isParam ? 127 + Math.max(-127, Math.min(127, pixels[index]*500)) : 255 * (1 - pixels[index]));
                        ctxt.fillStyle = `rgb(${grey},${grey},${grey})`;
                        ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                    }
                }
            }
            scope.$watchCollection('pixels', function(newVal, oldVal) {
                pixels = <Array<number>>newVal;
                if (pixels) {
                    redraw();
                }
            });
        };
    }

    public static Factory() {
        var directive = () => {
            return new DigitImageDirective();
        };

        directive['$inject'] = [];

        return directive;
    }
} 