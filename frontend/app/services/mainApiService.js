(function() {
    angular.module("com")
        .constant("baseUrl", "/api/")
        .service("com.mainApiService", mainApiService);

    function mainApiService($http, baseUrl) {

        this.get = function (url) {
            return $http({
                method: 'GET',
                url: baseUrl + url + '/'

            });
        };
    }
    mainApiService.$inject = ["$http", "baseUrl"];

})();
