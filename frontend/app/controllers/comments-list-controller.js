(function() {
    'use strict';
    angular.module('com').controller('com.commentsCtrl',['$scope','flashService', commentsCtrl]);

    function commentsCtrl($scope, flashService){
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
        $scope.comments = [
            {
                name: 'Alex',
                email: 'alex@gmail.com',
                baseurl: 'localhost',
                text: 'hello world'
            },
            {
                name: 'Piter',
                email: 'piter@gmail.com',
                baseurl: 'localhost',
                text: 'lorem ipsum'
            }
        ];
        
        $scope.saveComment = function (){
            $scope.comments.push({
                name: $scope.name,
                email: $scope.email,
                baseurl: $scope.baseurl,
                text: $scope.text

        })};

    }
})();