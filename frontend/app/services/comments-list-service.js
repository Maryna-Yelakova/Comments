(function() {
    angular.module("com").service("comments-list-service", commentsService);

    function commentsService(mainApiService) {
        this.getComments = function(page) {
            return mainApiService.get('comments/' + page);
        };
        this.saveComment = function(data){
            return mainApiService.post('comment',data);
        };
        this.getCommentsNumber = function(){
            return mainApiService.get('commentsnumber')
        }

    }
    commentsService.$inject = ["com.mainApiService"];
})();
