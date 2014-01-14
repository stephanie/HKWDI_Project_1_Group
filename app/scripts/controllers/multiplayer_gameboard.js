'use strict';

angular.module('tickeyApp')
    .controller('MultiplayerGameboardCtrl', function($scope, $routeParams, angularFire, $rootScope) {

        $rootScope.howButton = false;
        $rootScope.smallPlaybutton = true;

        $scope.gameboardId = $routeParams.number;
        $scope.mySymbol = $routeParams.symbol;

        $scope.gameboard = [];
        var gameboardRef = new Firebase("https://tictactoe-leaderboard.firebaseio.com/gameboard" + $scope.gameboardId);
        $scope.promise = angularFire(gameboardRef, $scope, "gameboard");

        $scope.turnNum = 0;
        $scope.myTurn = false;

        if ($scope.mySymbol == 'x') {
          $scope.otherPlayerSymbol = 'o'
        }
        if ($scope.mySymbol == 'o') {
          $scope.otherPlayerSymbol = 'x'
        }

        //     /*
        //       Step 1
        //     */
        //     //  $scope.promise.then (function () {
        //     //   console.log("In Game Board");
        //     //   console.log($scope.gameboardId);
        //     //   console.log($scope.mySymbol);      
        //     // });

        // Step 2

        $scope.promise.then(function() {
            $scope.gameboard = [];
            if ($scope.gameboard.length == 0 && $scope.mySymbol == 'x') {
                $scope.playermessage = "You are X. You make the first move!";
                $scope.myTurn = true;
                console.log("X working.. X's turn:" + $scope.myTurn);
                console.log("The other player's symbol is " + $scope.otherPlayerSymbol)
            } else {
                $scope.playermessage = "You are O. You make the second move.";
                $scope.myTurn = false;
                console.log("O working.. O's turn:" + $scope.myTurn);
                console.log("The other player's symbol is " + $scope.otherPlayerSymbol)
            }
        });

        gameboardRef.on('value', function(snapshot) {
            console.log("Wait received");
            if (!$scope.myTurn) {
                if (snapshot.val() != null) {
                    if (!arrays_equal(snapshot.val(), $scope.gameboard)) {
                        console.log("Move made on opponent's gameboard");
                        if ($scope.isLosing($scope.otherPlayerSymbol)) {
                        console.log("The other player won")
                        $scope.playermessage = ("You lost!")
                        $scope.restartGame();
                            // redirect to match player if play again

                        } 
                        // else if ($scope.isDraw()) {
                        //     // print draw
                        //     // redirect to match player if play again
                        // } 
                        else {
                            $scope.myTurn = true;
                        }
                    } else {
                        console.log("Move made on my gameboard");
                    }
                } else {
                    console.log("Snapshot is empty");
                }
            } else {
                console.log("It is my turn");
            }
        });

        function arrays_equal(a, b) {
            return !(a < b || b < a);
        }

        $scope.handleClick = function(index) {
            console.log("Gameboard clicked");
            if ($scope.myTurn) {
                if ($scope.notOccupied(index)) {
                    $scope.makeNextMove(index, $scope.mySymbol);
                    if ($scope.isWinning($scope.mySymbol)) {
                        console.log("Registered yes to winning");
                        $scope.playermessage = ("You won!");
                        window.setTimeout(function() {
                            $scope.restartGame();
                        }, 100);
                    } else if ($scope.turnNum == 8) {
                        $scope.playermessage = ("Tie!");
                        window.setTimeout(function() {
                            $scope.restartGame();
                        }, 100);
                    } else {
                        $scope.myTurn = false;
                    }
                }
            }
        }

        $scope.notOccupied = function(index) {
            var result = ($scope.gameboard[index] == null);
            console.log("notOccupied worked");
            return result;
        }

        $scope.makeNextMove = function(index) {
            $scope.gameboard[index] = $scope.mySymbol;
            console.log("makeNextMove worked");
            $scope.turn();
        }

        $scope.isLosing = function(currentPlayer) {
            $scope.isWinning(currentPlayer);
        }

        $scope.isWinning = function(currentPlayer) {

            for (var i = 0; i <= 8; i += 3) {
                if ($scope.isSameSymbolsIn(i, i + 1, i + 2, currentPlayer)) {
                    return true;
                    console.log("isSameSymbols horizontally")
                }
            }

            for (var i = 0; i <= 2; i++) {
                if ($scope.isSameSymbolsIn(i, i + 3, i + 6, currentPlayer)) {
                    return true;
                    console.log("isSameSymbols horizontally")
                }
            }

            // check diagonal
            return $scope.isDiagonalSameSymbols(currentPlayer);
        }

        $scope.isSameSymbolsIn = function(first_cell_id, second_cell_id, third_cell_id, currentPlayer) {
            var first_comparison = $scope.gameboard[first_cell_id] == currentPlayer;
            var second_comparison = $scope.gameboard[second_cell_id] == currentPlayer;
            var third_comparison = $scope.gameboard[third_cell_id] == currentPlayer;

            var result = first_comparison && second_comparison && third_comparison;
            return result;
        }

        $scope.isDiagonalSameSymbols = function(currentPlayer) {
            var firstDiagonalCheck = ($scope.gameboard[0] == currentPlayer &&
                $scope.gameboard[4] == currentPlayer &&
                $scope.gameboard[8] == currentPlayer);
            var secondDiagonalCheck = ($scope.gameboard[2] == currentPlayer &&
                $scope.gameboard[4] == currentPlayer &&
                $scope.gameboard[6] == currentPlayer);
            return firstDiagonalCheck || secondDiagonalCheck;
        }

        $scope.turn = function() {
            $scope.turnNum += 1;
        }

        $scope.restartGame = function() {
          for (var i = 0; i <= 8; i++) {
                $scope.gameboard[i] = "";
                $scope.turnNum = 0;  
          }
        }

});