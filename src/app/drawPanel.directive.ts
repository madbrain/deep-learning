
interface DrawPanelScope extends ng.IScope {
    width: number;
    height: number;
    pixels: Array<number>;
    onDraw: () => void;
}

export class DrawPanelDirective {

    public restrict = "EA";
    public template = "<canvas style='border:1px solid black' width='{{width}}' height='{{height}}'></canvas>";
    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    public scope = {
        width: '@',
        height: '@',
        pixels: '=',
        onDraw: '&'
    };

    constructor() {
        DrawPanelDirective.prototype.link = (scope: DrawPanelScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            const xStep = scope.width / 28;
            const yStep = scope.height / 28;
            const isParam = scope.isParam === undefined ? false : scope.isParam;
            const canvas = <HTMLCanvasElement>element.find("canvas")[0];
            const ctxt = canvas.getContext("2d");
            let pixels = [];
            let isDrawing = false;

            function drawPixel(x, y) {
                if (x >= 0 && x < 28 && y >= 0 && y < 28) {
                    const index = x + y*28;
                    pixels[index] = 1;
                    redraw();
                }
            }

            element.bind('mousedown', (event) => {
                isDrawing = true;
            });

            element.bind('mouseup', (event) => {
                isDrawing = false;
                scope.$apply(() => {
                    scope.onDraw();
                });
            });

            element.bind('mousemove', (event) => {
                if (isDrawing) {
                    let x = Math.floor(event.offsetX/xStep);
                    let y = Math.floor(event.offsetY/yStep);
                    for (let dx = -1; dx < 1; ++dx) {
                        for (let dy = -1; dy < 1; ++dy) {
                            drawPixel(x + dx, y + dy);
                        }
                    }
                }
            });

            function redraw() {
                for (let y = 0; y < 28; y++) {
                    for (let x = 0; x < 28; x++) {
                        const index = y*28+x;
                        const grey = Math.floor(255 * (1 - pixels[index]));
                        ctxt.fillStyle = `rgb(${grey},${grey},${grey})`;
                        ctxt.fillRect(x * xStep, y * yStep, xStep, yStep);
                    }
                }
            }

            scope.$watch('pixels', function(newVal, oldVal) {
                pixels = <Array<number>>newVal;
                if (pixels) {
                    redraw();
                }
            });
        };
    }

    public static Factory() {
        const directive = () => {
            return new DrawPanelDirective();
        };

        directive['$inject'] = [];

        return directive;
    }
} 