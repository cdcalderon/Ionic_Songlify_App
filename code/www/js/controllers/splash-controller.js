/**
 * Created by carlos on 5/9/2015.
 */
angular.module('songlify.controllers').controller('SplashCtrl', function($scope, User, $state) {
    $scope.submitForm = function(username, password, signingUp) {
        User.auth(username, password,  signingUp).then(function () {
            $state.go('tab.songList');
        }, function () {
            alert('Please try again');
        });
    }
});