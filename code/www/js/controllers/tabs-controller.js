/**
 * Created by carlos on 5/9/2015.
 */
/*
 Controller for our tab bar
 */
angular.module('songlify.controllers').controller('TabsCtrl', function($scope, Suggestions, User, $window) {
    $scope.enteringFavorites = function() {
        User.newFavorites = 0;
        Suggestions.haltAudio();
    };

    $scope.leavingFavorites = function(){
        Suggestions.init();
    };

    $scope.logout = function() {
        User.destroySession();

        $window.location.href = 'index.html';
    };
    $scope.favoriteCount = User.favoriteCount;
})