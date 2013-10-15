'use strict';

angular.module('tickeyApp')
.controller('GameboardCtrl', function ($scope, $rootScope, $timeout, $location, localStorageService, angularFire) {

var ref = new Firebase('https://hkwdi1.firebaseio.com/leaderBoard');
var p = angularFire(ref, $scope,"leaderData");
$scope.leaderData = {};

p.then(function(){
  console.log($scope.leaderData);
})

// $scope.leaderData = {person: 
// {name: 'Steph', 
// value: 'Thanks Deepak!'}
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

$scope.cells = ["", "", "", "", "", "", "", "", ""];

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

if ($scope.turnNum == 1);
$scope.start();
 
$scope.stop = function() {
    $timeout.cancel($scope.stoptimer);
  }

$scope.turn = function() {
      $scope.turnNum += 1;
}

$scope.handleClick = function (location) {
  if ($scope.notOccupied(location)) {
    $scope.makeNextMove(location, $scope.currentSymbol);
    if ($scope.isWinning($scope.currentSymbol)) {
      alert($scope.currentSymbol + " wins!");
      $scope.addGamePoint();
      $scope.restartGame();
    } else if ($scope.turnNum == 9) {
      alert("Tie!");
      $scope.addTieGamePoint();
      $scope.restartGame();
    } else {
      $scope.swapSymbol();
      if ($scope.turnNum < 9) {
        $scope.selectRandomSquare($scope.currentSymbol);
        if ($scope.isWinning($scope.currentSymbol)) {
          alert($scope.currentSymbol + " wins!");
          $scope.addGamePoint();
          $scope.restartGame();
        } else {
          $scope.swapSymbol();
        }
      } else {
        $scope.swapSymbol();
      }
    }    
  } else {
  }
}

$scope.makeNextMove = function (location, symbol) {  
  $scope.cells[location - 1] = symbol;
  $scope.turn();
}

$scope.swapSymbol = function() {
  if ($scope.currentSymbol == "x") {
    $scope.currentSymbol = "o";
  } else {
    $scope.currentSymbol = "x";
  }
}

$scope.notOccupied = function (location) {
  var result = ($scope.cells[location - 1] == "");
  return result;
}

$scope.isWinning = function (currentPlayer) {

  for (var i=0; i <= 8; i += 3) {
    if ($scope.isSameSymbolsIn(i, i + 1, i + 2, currentPlayer)) {
      return true;
    }
  }

  for (var i=0; i <= 2; i++) {
    if ($scope.isSameSymbolsIn(i, i + 3, i + 6, currentPlayer)) {
      return true;
    }
  }

  // check diagonal
  return $scope.isDiagonalSameSymbols(currentPlayer);
}

$scope.isSameSymbolsIn = function (first_cell_id, second_cell_id, third_cell_id, currentPlayer) {
  var first_comparison = $scope.cells[first_cell_id] == currentPlayer;
  var second_comparison = $scope.cells[second_cell_id] == currentPlayer;
  var third_comparison = $scope.cells[third_cell_id] == currentPlayer;

  var result = first_comparison && second_comparison && third_comparison;
  return result;
}

$scope.isDiagonalSameSymbols = function (currentPlayer) {
  var firstDiagonalCheck = ($scope.cells[0] == currentPlayer &&
    $scope.cells[4] == currentPlayer &&
    $scope.cells[8] == currentPlayer);
  var secondDiagonalCheck = ($scope.cells[2] == currentPlayer &&
    $scope.cells[4] == currentPlayer &&
    $scope.cells[6] == currentPlayer);
  return firstDiagonalCheck || secondDiagonalCheck;
}

$scope.clearBoard = function() {
  for ( var i=0 ; i <= 8; i++ ) {
 
    $scope.cells[i] = "";
  }
}

$scope.restartGame = function() {
  $scope.currentSymbol = "x";
  $scope.turnNum = 0;
  $scope.clearBoard();
}

$scope.selectRandomSquare = function (currentPlayer) {
  var randomNumber;

  do {
    randomNumber = Math.floor((Math.random()*9)+1);
  } while( !$scope.notOccupied(randomNumber) );

  $scope.makeNextMove(randomNumber, currentPlayer);
}

$scope.addGamePoint = function() {
  if ($scope.currentSymbol == "x") {
    $scope.xScore = $scope.xScore + 1;
    localStorageService.add('xScore', $scope.xScore);
  } else {
    $scope.oScore = $scope.oScore + 1;;
  } 
}

$scope.addTieGamePoint = function() {
  $scope.tieScore = $scope.tieScore + 1;}
});

// $timeout(function alert($scope.currentSymbol + " wins!")[, 1000]);
