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
        };
        this.addEnclosedComments = function(id,data){
            return mainApiService.post('answer/' + id, data)
        };
        this.getSortedComments = function(sortparam,arrow,page){
            return mainApiService.get('sortedcomments/sortby/' + sortparam +'/orderby/' + arrow + '/showpage/' + page);
        }
    }
    commentsService.$inject = ["com.mainApiService"];
})();
