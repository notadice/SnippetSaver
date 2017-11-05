
angular.module('snippetSaver')
.directive('stringToArray', function () {
    return {
        // $parsers/$formatters live on the
        // ngModel controller, so we need this!
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            ngModel.$parsers.push(function toModel(input) {
                // do something to format user input
                // to be more "computer-friendly"
                input.replace(/\s/g, '');
                var modifiedInput = input.split(/,\s*/)
                return modifiedInput;
            });

            ngModel.$formatters.push(function toView(input) {
                // do something to format user input
                // to be more "human-friendly"
                if(input && input.join)
                var modifiedInput = input.join(', ')
                return modifiedInput;
            });
        }
    };
});
