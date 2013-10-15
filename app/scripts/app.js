'use strict';

angular.module('LocalStorageModule').value('prefix', 'gameScore');
angular.module('tickeyApp', ['LocalStorageModule', 'firebase'])
     .config(function ($routeProvider) {
     $routeProvider
          .when('/gameboard', {
          templateUrl: 'views/gameboard.html',
          controller: 'GameboardCtrl'
     })
          .when('/how', {
          templateUrl: 'views/how.html',
          controller: 'HowCtrl'
     })
          .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     })

          .otherwise({
          redirectTo: '/'
     })
});