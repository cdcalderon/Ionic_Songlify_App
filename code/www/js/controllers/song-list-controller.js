/**
 * Created by carlos on 5/9/2015.
 */
angular.module('songlify.controllers').controller('SongListCtrl',
    function($scope, $timeout, User, Suggestions, $ionicLoading) {
    var showLoading = function(){
        $ionicLoading.show({
            template: '<i class="ion-loading-c" ></i>',
            noBackdrop: true
        })
    };
    showLoading();
    //Ionic Contrib: Tinder Cards methods Begin
    $scope.cardDestroyed = function(index) {
        Suggestions.nextSong();
        $timeout(function(){
            $scope.playingSong = Suggestions.queue[0];
            $scope.recommendations = [$scope.playingSong];
        }, 300);
        Suggestions.playCurrentSong().then(function(){
            $scope.playingSong.loaded = true;
        });
    };

    // Using: Ionic Contrib: Tinder Cards
    $scope.cardSwiped = function(index) {
    };

    $scope.cardSwipedLeft = function(index) {
        console.log('LEFT SWIPE');
    };

    $scope.cardSwipedRight = function(index) {
        console.log('RIGHT SWIPE');
        User.addSongToFavorites($scope.playingSong);
    };

    var hideLoading = function(){
        $ionicLoading.hide();
    };

    Suggestions.init().then(function(){
        $scope.playingSong = Suggestions.queue[0];
        $scope.recommendations = [$scope.playingSong];
        return Suggestions.playCurrentSong()
            .then(function(){
                hideLoading();
                $scope.playingSong.loaded = true;
            });

    });

    $scope.processSelection = function(isRated){
        if(isRated){
            User.addSongToFavorites($scope.playingSong);
        }
        $scope.playingSong.rated = isRated;
        $scope.playingSong.hide = true;
        Suggestions.nextSong();
        $timeout(function(){
            $scope.playingSong = Suggestions.queue[0];
        }, 300);
        Suggestions.playCurrentSong().then(function(){
            $scope.playingSong.loaded = true;
        });
    };

    $scope.nextAlbumImg = function(){
        if(Suggestions.queue.length > 1){
            return Suggestions.queue[1].image_large;
        }
        return '';
    };
});