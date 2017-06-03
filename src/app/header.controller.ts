
export class HeaderController {

    constructor(private $location: angular.ILocationService) {
    }

    public isActive(viewLocation) { 
        return viewLocation === this.$location.path();
    };
}