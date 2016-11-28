(function() {
angular.module('com').directive('resize', function () {
    return {
            restrict: 'A',
            scope: {},
            link: function(scope, elem, attrs) {
                elem.css('height', '240px');
                elem.css('width', '320px')
            }
        };
    });
})();