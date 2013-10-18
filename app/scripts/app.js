'use strict';

angular.module('LocalStorageModule').value('prefix', 'gameScore');
angular.module('tickeyApp', ['LocalStorageModule', 'firebase'])
     .config(function ($routeProvider) {
     $routeProvider
          .when('/gameboard/:number/:symbol', {
          templateUrl: 'views/multiplayer_gameboard.html',
          controller: 'MultiplayerGameboardCtrl'
     })
          .when('/gameboard/', {
          templateUrl: 'views/gameboard.html',
          controller: 'GameboardCtrl'
     })
          .when('/how', {
          templateUrl: 'views/how.html',
          controller: 'HowCtrl'
     })
          .when('/scoreboard', {
          templateUrl: 'views/scoreboard.html',
          controller: 'ScoreboardCtrl'
     })
          .when('/name', {
          templateUrl: 'views/name.html',
          controller: 'NameCtrl'
     })
          .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     })
          .when('/match_online_player', {
            templateUrl: 'views/match_online_player.html',
            controller: 'MatchOnlinePlayerCtrl'
          })
          .otherwise({
          redirectTo: '/'
     })
});