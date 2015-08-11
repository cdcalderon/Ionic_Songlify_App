/**
 * Created by carlos on 5/9/2015.
 */
angular.module('songlify.services').factory('User', function($http, $q, $localstorage, SERVER, Azureservice){
    var service ={
        favorites: [],
        newFavorites: 0,
        session_id: false,
        username: false
    };

    service.auth = function(username, password, signingup){
        var authRoute;
        if(signingup){
            authRoute = 'signup';
            return Azureservice.insert('member', {
                username: username,
                password: password
            })
                .then(function(data) {
                    service.setSession(data.username, data.sessionId, data.favorites);
                }, function(err) {
                    console.log('Azure Error: ');
                });
        } else {
            authRoute = 'login';
            return Azureservice.read('member',{
                id: username
            })
                .then(function(data) {
                    service.setSession(data.userName, data.sessionId, data.favorites);
                }, function(err) {
                    console.log('Azure Error: ');
                });
        }
    };

    // handle session data
    service.setSession = function(username, session_id, favorites) {
        if (username) service.username = username;
        if (session_id) service.session_id = session_id;
        if (favorites) service.favorites = favorites;
        $localstorage.setObject('user', { username: username, session_id: session_id });
    };

    service.checkSession = function() {
        var defer = $q.defer();

        if (service.session_id) {
            defer.resolve(true);

        } else {
            var user = $localstorage.getObject('user');

            if (user.username) {
                //get favs is user in local storage
                service.setSession(user.username, user.session_id);
                service.populateFavorites().then(function() {
                    defer.resolve(true);
                });

            } else {
                //not in localstorage... reject
                defer.resolve(false);
            }

        }

        return defer.promise;
    };

    service.destroySession = function() {
        $localstorage.setObject('user', {});
        service.username = false;
        service.session_id = false;
        service.favorites = [];
        service.newFavorites = 0;
    };

    service.favoriteCount = function(){
        return service.newFavorites;
    };

    service.addSongToFavorites = function(song){
        if(!song){return false;}
        service.newFavorites++;
        service.favorites.unshift(song);

        return Azureservice.invokeApi('favorite', {
            method: 'PUT',
            parameters: {
                sessionId: service.session_id,
                songId: song.songId }
        }).then(function (results) {
            console.log('Query successful');
        }, function (error) {
            console.log('Azure Error: ');
        });
    };

    service.removeSongFromFavorites = function(song, index){
        if(!song){return false;}
        service.favorites.splice(index, 1);

        return Azureservice.invokeApi('favorite', {
            method: 'DELETE',
            parameters: {
                songId: song.songId,
                sessionId: service.session_id }
        }).then(function (results) {
            console.log('Query successful');
        }, function (error) {
            console.log('Azure Error: ');
        });
    };

    service.populateFavorites = function() {
        return Azureservice.invokeApi('favorite', {
            method: 'GET',
            parameters: {
                sessionId: service.session_id
            }
        }).then(function (data) {
            service.favorites = data;
            console.log('Query successful');
        }, function (error) {
            console.log('Azure Error: ');
        });
    };
    return service;

});