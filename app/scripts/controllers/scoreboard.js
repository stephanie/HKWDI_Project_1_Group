'use strict';

angular.module('tickeyApp')
.controller('ScoreboardCtrl', function ($scope, angularFire, $rootScope) {
    
    $rootScope.howButton = true;
    $rootScope.smallPlaybutton = false;
    
  	var ref = new Firebase('https://tictactoe-leaderboard.firebaseio.com/');
	$scope.leaderboardData = [];
	var p = angularFire(ref, $scope,"leaderboardData");

// p.then(function(){
//    console.log($scope.leaderboardData);
});

