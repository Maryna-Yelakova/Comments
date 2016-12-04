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
        this.post = function (url,data,config){
            if (config) {
                var fd = new FormData();
                for (var key in data) {
                    fd.append(key, data[key]);
                }
                return $http.post(baseUrl + url + '/', fd, {
                    transformRequest: angular.indentity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            } else {
                return $http.post(baseUrl + url + '/', data);
            }
        }
    }
    mainApiService.$inject = ["$http", "baseUrl"];

})();
