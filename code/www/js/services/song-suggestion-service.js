/**
 * Created by carlos on 5/9/2015.
 */
angular.module('songlify.services').factory("Suggestions", function($http, SERVER, $q, Azureservice){
    var service = {
        queue: []
    };

    var media;

    service.init = function(){
        if(service.queue.length === 0){
            return service.getNextSongs();
        }else{
            return service.playCurrentSong();
        }
    };

    service.getRecommendationsAzure = function(){
        return Azureservice.query('Recommendation').then(function(recommendations){

            return recommendations;
        }, function(error){
            console.log(error)
        });
    }

    service.getNextSongs = function(){
        return Azureservice.query('Recommendation').then(function(recommendations){
            service.queue = service.queue.concat(recommendations);
        }, function(error){
           console.log(error);
        });
    };

    service.nextSong = function(){
        service.queue.shift();
        service.haltAudio();

        if(service.queue.length <= 3){
            service.getNextSongs();
        }
    };

    service.playCurrentSong = function(){
        var defer = $q.defer();
        media = new Audio(service.queue[0].previewUrl);

        media.addEventListener("loadeddata", function(){
            defer.resolve();
        });

        media.play();
        return defer.promise;
    };

    service.haltAudio = function(){
        if(media){
            media.pause();
        }
    };
    return service
});