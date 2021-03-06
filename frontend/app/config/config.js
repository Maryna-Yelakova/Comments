(function() {
    angular.module("com").config(["$routeProvider", "$locationProvider",  function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/", {
                templateUrl: "views/comments.html",
                controller: "com.commentsCtrl",
                resolve: {
                    commentList: ["comments-list-service", function(commentsService) {
                        return commentsService.getComments(1);
                    }],
                    numberOfComments: ["comments-list-service", function(commentsService) {
                        return commentsService.getCommentsNumber();
                    }]
                }
            })
            .otherwise({
             redirectTo: "/"
            });
    }]);
})();
