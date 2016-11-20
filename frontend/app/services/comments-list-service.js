(function() {
    angular.module("com").service("comments-list-service", commentsService);

    function commentsService(mainApiService) {
        this.getComments = function() {
            return mainApiService.get('comments');
        };
        this.saveComment = function(data){
            return mainApiService.post('comment',data);
        }

    }
    commentsService.$inject = ["com.mainApiService"];
})();
