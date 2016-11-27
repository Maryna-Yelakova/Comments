(function() {
    'use strict';     
    angular.module('com').controller('com.commentsCtrl',['$scope','flashService','commentList','numberOfComments','comments-list-service', commentsCtrl]);
    function commentsCtrl($scope, flashService,commentList,numberOfComments,commentsService){
        $scope.username = /^[a-zA-Z0-9\s]{3,50}$/;
        $scope.useremail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        $scope.usercomment = /\w+/;
        $scope.checkName = function() {
            if ($scope.commentForm.name.$invalid) {
                flashService.error('Only latin symbols and  numbers length between 3 and 50', false);
            } else {
                flashService.clearFlashMessage();
            }
        };
        $scope.checkEmail = function() {
            if ($scope.commentForm.email.$invalid) {
                flashService.error('Please, enter valid email', false);
            } else {
                flashService.clearFlashMessage();
            }
        };
        $scope.checkText = function() {
            if ($scope.commentForm.text.$invalid) {
                flashService.error('Please, type your comment', false);
            } else {
                flashService.clearFlashMessage();
            }
        };

        $scope.getCommentsByPage = function(){
            if ($scope.reverseSort){
                var arrow = 'desc';
            }else{
                arrow = 'asc';
            }
            return commentsService.getSortedComments($scope.sortparam,arrow,$scope.currentPage);
        };

        $scope.firstPage = function() {
            return $scope.currentPage == 1;
        };
        $scope.lastPage = function() {
            return $scope.currentPage == $scope.lastPageNum;
        };
        $scope.startingItem = function() {
            return $scope.currentPage * $scope.commentsPerPage;
        };
        $scope.pageBack = function() {
            $scope.currentPage = $scope.currentPage - 1;
            $scope.getCommentsByPage().then(function(response){
                $scope.comments = response.data;
            });
        };
        $scope.pageForward = function() {
            $scope.currentPage = $scope.currentPage + 1;
            $scope.getCommentsByPage().then(function(response){
                $scope.comments = response.data;
            });
        };
        $scope.goToFirstPage = function(){
            $scope.currentPage = 1;
            $scope.getCommentsByPage().then(function(response){
                $scope.comments = response.data;
            });
        };
        $scope.goToLastPage = function(){
            $scope.currentPage = $scope.lastPageNum;
            $scope.getCommentsByPage().then(function(response){
                $scope.comments = response.data;
            });
        };

        $scope.addComment = function(){
            if(angular.isObject($scope.createComment.attachment)){
                commentsService.saveCommentWithFile($scope.createComment).then(function () {
                    $scope.getCommentsByPage().then(function(response){
                        $scope.comments = response.data;
                        $scope.updateCommentsCount();
                        $scope.createComment={};
                        $("#media").val('');
                        $scope.commentForm.$setPristine();
                    });
                });
            }else{
                commentsService.saveComment($scope.createComment).then(function () {
                    $scope.getCommentsByPage().then(function(response){
                        $scope.comments = response.data;
                        $scope.updateCommentsCount();
                        $scope.createComment={};
                        $scope.commentForm.$setPristine();
                    });
                });
            }
        };
        $scope.updateCommentsCount = function () {
            commentsService.getCommentsNumber().then(function(response){
                $scope.numberComments = response.data[0].count;
                $scope.updateLastPageNum();
            })
        };
        $scope.updateLastPageNum = function () {
            var maxPageNum = Math.ceil( $scope.numberComments / $scope.commentsPerPage);
            if (maxPageNum === 0){
                $scope.lastPageNum = 1;
            }else{
                $scope.lastPageNum = maxPageNum;
            }
        };
        $scope.cancelAnswer = function(){
            $scope.createAnswer = {id: -1};

        };
        $scope.showAnswerForm = function (commentId){
            $scope.createAnswer = {id:commentId};
        };
        $scope.addAnswer = function (parrentId){
            var newComment = $scope.createAnswer;
            commentsService.addEnclosedComments(parrentId,newComment).then(function(){
                $scope.getCommentsByPage().then(function(response){
                    $scope.comments = response.data;
                    $scope.updateCommentsCount();
                    $scope.createAnswer = {};
                });
            })
        };
        $scope.sortComments = function (sortparam){
            if (sortparam === $scope.sortparam){
                $scope.reverseSort =!$scope.reverseSort;
            }else{
                $scope.sortparam = sortparam;
            }
            $scope.currentPage = 1;
            $scope.getCommentsByPage().then(function(response) {
                $scope.comments = response.data;
                $scope.updateCommentsCount();
            });
        };
        $scope.angular = angular;
        $scope.comments = commentList.data;
        $scope.createComment = {};
        $scope.numberComments = numberOfComments.data[0].count;
        $scope.currentPage = 1;
        $scope.commentsPerPage = 5;
        $scope.reverseSort = false;
        $scope.sortparam = 'date';
        $scope.updateLastPageNum();


    }
})();