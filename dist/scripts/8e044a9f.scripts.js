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
'use strict';

angular.module('tickeyApp')
.controller('MainCtrl', function ($scope, $rootScope, localStorageService) {
    
    $scope.name = "Tickety";
    $rootScope.howButton = false;
    $rootScope.smallPlaybutton = true;

    $scope.clicked = function () {
    	$scope.clicked = true;
    }

  });

// 'use strict';

// angular.module('tickeyApp')
// .controller('NameCtrl', function ($scope, angularFire) {

// var ref = new Firebase('https://tictactoe-leaderboard.firebaseio.com/leader_data');
// $scope.leaderData = {};
// var p = angularFire(ref, $scope,"leaderData");

// // $scope.leaderboardData.push({name: "Stephanie", points: "9"});

// p.then(function(){
//    console.log($scope.leaderboardData);
// })

// // $scope.leaderData =
// //   {Name: 'Steph', 
// //    Points: '9'};

// $scope.getUserName = function () {
// 	$scope.userName = document.name.userName.value;
// }

// console.log($scope.getUserName)

// });
'use strict';

angular.module('tickeyApp')
    .controller('GameboardCtrl', function($scope, $rootScope, $timeout, $location, angularFire) {

        var ref = new Firebase('https://tictactoe-leaderboard.firebaseio.com/leaderData');
        $scope.leaderData = {};
        var p = angularFire(ref, $scope, "leaderData");

        // p.then(function(){
        //    console.log($scope.leaderData);
        // })

        // $scope.leaderData =
        //    {Name: 'Steph', 
        //    Points: '9'};

        // $scope.addWinToLeaderboard = function() {
        //   if ($scope.userName) {
        //     if ($scope.leaderData.name.hasOwnProperty($scope.userName)) {
        //       $scope.leaderData.name[$scope.userName] == $scope.xScore;
        //      } else {
        //         $scope.leaderData.name[$scope.userName]=0;
        //       }
        //     }
        // };

        $scope.timeleft = 60;
        $scope.stoptimer;
        $rootScope.howButton = false;
        $rootScope.smallPlaybutton = true;
        $scope.currentSymbol = "x";
        $scope.turnNum = 0;
        $scope.name = "Tickety";

        $scope.xScore = parseInt(localStorageService.get('storedXScore'));
        if ($scope.xScore == undefined);
        $scope.xScore = 0;

        $scope.oScore = parseInt(localStorageService.get('storedOScore'));
        if ($scope.oScore == undefined);
        $scope.oScore = 0;

        $scope.tieScore = parseInt(localStorageService.get('storedTieScore'));
        if ($scope.tieScore == undefined);
        $scope.tieScore = 0;

        $scope.gameboard = ["", "", "", "", "", "", "", "", ""];

        $scope.start = function() {
            $scope.stoptimer = $timeout(function() {
                if ($scope.timeleft > 0) {
                    $scope.timeleft = $scope.timeleft - 1;
                    $scope.start();
                } else if ($scope.timeleft == 0) {
                    $location.path('/scoreboard');
                } else {
                    $timeout.cancel($scope.stoptimer);
                }
            }, 1000);
        }

        $scope.stop = function(value) {
            $timeout.cancel($scope.stoptimer);
        }

        $scope.turn = function() {
            $scope.turnNum += 1;
            if ($scope.turnNum === 1 && $scope.timeleft == 60) {
                $scope.start();
            }
        }

        $scope.handleClick = function(location) {
            if ($scope.notOccupied(location)) {
                $scope.makeNextMove(location, $scope.currentSymbol);
                if ($scope.isWinning($scope.currentSymbol)) {
                    alert($scope.currentSymbol + " wins!");
                    // $scope.addGamePoint();
                    $scope.restartGame();
                    return;
                }
                if ($scope.turnNum == 9) {
                    alert("Tie!");
                    // $scope.addTieGamePoint;
                    $scope.restartGame();
                } else {
                    $scope.swapSymbol();
                    if ($scope.turnNum < 9) {
                        $scope.selectRandomSquare($scope.currentSymbol);
                        if ($scope.isWinning($scope.currentSymbol)) {
                            alert($scope.currentSymbol + " wins!");
                            // $scope.addGamePoint;
                            $scope.restartGame();
                        } else {
                            $scope.swapSymbol();
                        }
                    } else {
                        $scope.swapSymbol();
                    }
                }
            } else {}
        }

        $scope.makeNextMove = function(location, symbol) {
            $scope.gameboard[location] = symbol;
            $scope.turn();
        }

        $scope.swapSymbol = function() {
            if ($scope.currentSymbol == "x") {
                $scope.currentSymbol = "o";
            } else {
                $scope.currentSymbol = "x";
            }
        }

        $scope.notOccupied = function(location) {
            var result = ($scope.gameboard[location] == "");
            return result;
        }

        $scope.isWinning = function(currentPlayer) {

            for (var i = 0; i <= 8; i += 3) {
                if ($scope.isSameSymbolsIn(i, i + 1, i + 2, currentPlayer)) {
                    return true;
                }
            }

            for (var i = 0; i <= 2; i++) {
                if ($scope.isSameSymbolsIn(i, i + 3, i + 6, currentPlayer)) {
                    return true;
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

        $scope.clearBoard = function() {
            for (var i = 0; i <= 8; i++) {

                $scope.gameboard[i] = "";
            }
        }

        $scope.restartGame = function() {
            $scope.currentSymbol = "x";
            $scope.turnNum = 0;
            $scope.playermessage = ("");
            $scope.clearBoard();
        }

        $scope.selectRandomSquare = function(currentPlayer) {
            var randomNumber;

            do {
                randomNumber = Math.floor((Math.random() * 9) + 1);
            } while (!$scope.notOccupied(randomNumber));

            $scope.makeNextMove(randomNumber, currentPlayer);
        }

    //     $scope.addGamePoint = function() {
    //         if ($scope.currentSymbol == "x") {
    //             $scope.xScore = $scope.xScore + 1;
    //             localStorageService.add('xScore', $scope.xScore);
    //         } else {
    //             $scope.oScore = $scope.oScore + 1;;
    //         }
    //     }

    //     $scope.addTieGamePoint = function() {
    //         $scope.tieScore = $scope.tieScore + 1;
    //     }
    // });

// $timeout(function alert($scope.currentSymbol + " wins!")[, 1000]);
'use strict';

angular.module('tickeyApp')
.controller('HowCtrl', function ($scope, $rootScope) {
    
    $scope.name = "Tickety";
    $rootScope.howButton = true;
    $rootScope.smallPlaybutton = false;
  });
'use strict';

angular.module('tickeyApp')
	.directive("changeColor", function(){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('mouseenter', function(value) {
						element.css('color', (value? 'rgb(193,39,45)' : attrs.redColor));
                    });
                    element.bind('mouseleave', function(value) {
                    	element.css('color', (value? 'black' : attrs.blackColor));
                        console.log("Back to black!");
                    });
              }
          }
    })

/* Version 1
angular.module('tickeyApp')
	.directive("changeColor", function(){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('mouseenter', function(objEvent) {
                        window.eventObj = objEvent;
                        objEvent.target.className += 'o';
                    });
                    element.bind('mouseleave', function(objEvent) {
                        objEvent.target.classList.remove('o');
                        console.log("Color removed!");
                    });
              }
          }
    })    
*/ 

//or can use element.addClass()
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
                $scope.playermessage = "You are X. Make the first move!";
                $scope.myTurn = true;
                console.log("X working.. X's turn:" + $scope.myTurn);
                console.log("The other player's symbol is " + $scope.otherPlayerSymbol)
            } else {
                $scope.playermessage = "You are O. Make the next move.";
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
                        $scope.restartGame();
                    } else if ($scope.turnNum == 8) {
                        scope.playermessage = ("Tie!");
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