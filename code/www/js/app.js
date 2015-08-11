angular.module('songlify', ['ionic', 'songlify.controllers', 'ionic.contrib.ui.tinderCards', 'azure-mobile-service.module'])
    .constant('AzureMobileServiceClient',{ API_URL: "https://songlifyapi.azure-mobile.net/", API_KEY: 'PETFiubpAkwVGEHIFJnFSVqEgJywPm42'})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('splash', {
        url: '/',
        templateUrl: 'templates/splash.html',
        controller: 'SplashCtrl',
        onEnter: function($state, User){
          User.checkSession().then(function(hasSession) {
            if (hasSession) $state.go('tab.songList');
          });
        }
      })
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl',
        //no cargar state hasta tener user
        resolve: {
          populateSession: function(User) {
            return User.checkSession();
          }
        },
        onEnter: function($state, User){
          User.checkSession().then(function(hasSession) {
            if (!hasSession) $state.go('splash');
          });
        }
      })
      .state('tab.songList', {
        url: '/songList',
        views: {
          'tab-songList': {
            templateUrl: 'templates/songList.html',
            controller: 'SongListCtrl'
          }
        }
      })
      .state('tab.favorites', {
          url: '/favorites',
          views: {
            'tab-favorites': {
              templateUrl: 'templates/favorites.html',
              controller: 'FavoritesCtrl'
            }
          }
        });
  // fallback state:
  $urlRouterProvider.otherwise('/');

})

.constant('SERVER', {
  // Local server
  //url: 'http://localhost:3000'
  // Public Heroku server
  url: 'https://ionic-songhop.herokuapp.com'
});
