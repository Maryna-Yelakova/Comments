(function() {
    'use strict';     
    angular.module('com').controller('com.commentsCtrl',['$scope','flashService','commentList','numberOfComments','comments-list-service','$q','$sanitize', commentsCtrl]);
    function commentsCtrl($scope, flashService,commentList,numberOfComments,commentsService,$q,$sanitize){
        $scope.username = /^[a-zA-Z0-9\s]{3,50}$/;
        $scope.useremail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        // $scope.usercomment =/<(?!(br|strong)\s*\/?)[^>]+>/;
        // $scope.usercomment = /\w+/;
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
            }else if($scope.createComment.hasTags){
                flashService.error('Tags other then the following are restricted:<a></a>,<strong></strong>,<i></i>,<code></code>', false);
            }
            else {
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
        $scope.dataURItoBlob = function(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        };

        $scope.resizeImage = function (origImage,type,canvas) {
            var maxHeight = 320;
            var maxWidth = 240;
            var height = origImage.height;
            var width = origImage.width;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            canvas.ctx = ctx;
            ctx.drawImage(origImage, 0, 0, width, height);

            return canvas.toDataURL(type, 1);
            
        };

        $scope.fileRead  = function(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function() {
                deferred.resolve(reader.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };
        $scope.loadImage = function(url){
            var deferred = $q.defer();
            var img = new Image();
            img.src = url;
            img.onload = function () {
                deferred.resolve(img);
            };
            return deferred.promise;
        };

        $scope.addComment = function(){
            if(angular.isObject($scope.createComment.attachment)){
                var patt = /^image\/(png|jpeg)$/g;
                if(patt.test($scope.createComment.attachment.type)){
                    $scope.fileRead($scope.createComment.attachment).then(function(url){
                        $scope.loadImage(url).then(function(img){
                            $scope.createComment.attachment = $scope.dataURItoBlob($scope.resizeImage(img,$scope.createComment.attachment.type,$scope.canvas));
                            commentsService.saveCommentWithFile($scope.createComment).then(function () {
                                $scope.getCommentsByPage().then(function(response){
                                    $scope.comments = response.data;
                                    $scope.updateCommentsCount();
                                    $scope.createComment={};
                                    $("#media").val('');
                                    $scope.commentForm.$setPristine();
                                });
                            });
                        })
                    });
                }else{
                    commentsService.saveCommentWithFile($scope.createComment).then(function () {
                        $scope.getCommentsByPage().then(function(response){
                            $scope.comments = response.data;
                            $scope.updateCommentsCount();
                            $scope.createComment={};
                            $("#media").val('');
                            $scope.commentForm.$setPristine();
                        });
                    });
                }

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
            if(angular.isObject($scope.createAnswer.attachment)){
                var patt = /^image\/(png|jpeg)$/g;
                if(patt.test($scope.createAnswer.attachment.type)){
                    $scope.fileRead($scope.createAnswer.attachment).then(function(url){
                        $scope.loadImage(url).then(function(img){
                            $scope.createAnswer.attachment = $scope.dataURItoBlob($scope.resizeImage(img,$scope.createAnswer.attachment.type,$scope.canvasAnswer));
                            commentsService.addEnclosedCommentsWithFile(parrentId,$scope.createAnswer).then(function () {
                                $scope.getCommentsByPage().then(function(response){
                                    $scope.comments = response.data;
                                    $scope.updateCommentsCount();
                                    $scope.createAnswer={};
                                    $("#ansmedia").val('');
                                });
                            });
                        })
                    });
                }else{
                    commentsService.addEnclosedComments(parrentId,$scope.createAnswer).then(function () {
                        $scope.getCommentsByPage().then(function(response){
                            $scope.comments = response.data;
                            $scope.updateCommentsCount();
                            $scope.createAnswer={};
                            $("#ansmedia").val('');
                        });
                    });
                }

            }else{
                commentsService.addEnclosedComments(parrentId,$scope.createAnswer).then(function(){
                    $scope.getCommentsByPage().then(function(response){
                        $scope.comments = response.data;
                        $scope.updateCommentsCount();
                        $scope.createAnswer = {};
                    });
                })
            }
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
        $scope.isTxt = function(fileName){
            var patt = /.*\.txt$/g;
            return patt.test(fileName);
        };
        $scope.isPicture = function(fileName){
            var patt = /.*\.(jpeg|png|gif)$/g;
            return patt.test(fileName);
        };
        $scope.hasTagsInComment = function(){
            var patt = /<\/?(?!(a|strong>|code>|i>))[a-z][^>]*>/;
            $scope.createComment.hasTags= patt.test($scope.createComment.text);
        };


        $scope.angular = angular;
        $scope.comments = commentList.data;
        $scope.createComment = {};
        $scope.createComment.hasTags = false;
        $scope.numberComments = numberOfComments.data[0].count;
        $scope.currentPage = 1;
        $scope.commentsPerPage = 5;
        $scope.reverseSort = false;
        $scope.sortparam = 'date';
        $scope.updateLastPageNum();
        $scope.canvas = document.getElementById('picture');
        $scope.canvasAnswer = document.getElementById('anspicture');


    }
})();