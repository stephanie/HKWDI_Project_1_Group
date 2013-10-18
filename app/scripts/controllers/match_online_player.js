'use strict';

angular.module('tickeyApp')
    .controller('MatchOnlinePlayerCtrl', function($scope, angularFire, $location, $rootScope) {

    	$rootScope.howButton = false;
    	$rootScope.smallPlaybutton = true;

        console.log("Loading match online");
        $scope.waitingRoom = {};
        var refWaitingRoom = new Firebase('https://tictactoe-leaderboard.firebaseio.com/waitingRoom');
        $scope.promise = angularFire(refWaitingRoom, $scope, "waitingRoom");

        // $scope.promise.then (function(){
        // 	console.log("Data added");
        // 	$scope.createWaitingRoom();
        // });

        $scope.createWaitingRoom = (function() {
            $scope.waitingRoom = {
                xJoined: true,
                gameboardNumber: generateGameboardNumber()
            };
            $scope.noticeMessage = "Finding an opponent...";

            refWaitingRoom.on('child_removed', function(snapshot) {
                var gameboardNumber = $scope.waitingRoom.gameboardNumber;
                $location.path('gameboard/' + gameboardNumber + '/x')
            });
        });

        function generateGameboardNumber() {
            return Math.floor(Math.random() * 372841923).toString(16);
        }

        $scope.promise.then(function() {
            if ($scope.waitingRoom.xJoined == true) {
                $scope.joinWaitingRoom();
            } else {
                $scope.createWaitingRoom();
            }
        });

        $scope.joinWaitingRoom = function() {
            var gameboardNumber = $scope.waitingRoom.gameboardNumber;
            $scope.waitingRoom = {};
            $location.path('gameboard/' + gameboardNumber + '/o');
        }
    });