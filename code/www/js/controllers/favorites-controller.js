/**
 * Created by carlos on 5/9/2015.
 */
/*
 favorites page Ctrl
 */
angular.module('songlify.controllers')
    .controller('FavoritesCtrl', function($scope, User, $window) {
    $scope.favorites = User.favorites;
    $scope.username = User.username;

    $scope.removeSongFromFavorites = function(song, index){
        User.removeSongFromFavorites(song, index);
    };

    $scope.openSong = function(song){
        $window.open(song.open_url, "_system");
    }
});
