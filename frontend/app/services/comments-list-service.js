(function() {
    angular.module("com").service("comments-list-service", commentsService);

    function commentsService(mainApiService) {
            this.getComments = function() {
                return mainApiService.get('comments');
            };
    }
    commentsService.$inject = ["com.mainApiService"];
})();
