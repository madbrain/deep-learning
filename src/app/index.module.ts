
import {LinearRegController} from './linearReg.controller';
import {LogisticRegController} from './logisticReg.controller';
import {OldNetController} from './oldNet.controller';
import {LineChartDirective} from './linechart.directive';
import {PointRegChartDirective} from './pointreg.directive';
import {DigitImageDirective} from './digitimage.directive';
import {DrawPanelDirective} from './drawPanel.directive';
import {HeaderController} from './header.controller';

angular.module('app', [ "ngRoute" ])
    .config(function($routeProvider) {
        $routeProvider
            .when("/linearReg", {
                templateUrl : "views/linearReg.html",
                controller: LinearRegController,
                controllerAs: 'ctrl'
            })
            .when("/logisticReg", {
                templateUrl : "views/logisticReg.html",
                controller: LogisticRegController,
                controllerAs: 'ctrl'
            })
            .when("/oldNet", {
                templateUrl : "views/oldNet.html",
                controller: OldNetController,
                controllerAs: 'ctrl'
            })
            .otherwise("/linearReg");
    })
    .controller('HeaderController', HeaderController)
    .directive('pointRegressionChart', PointRegChartDirective.Factory())
    .directive('lineChart', LineChartDirective.Factory())
    .directive('digitImage', DigitImageDirective.Factory())
    .directive('drawPanel', DrawPanelDirective.Factory());