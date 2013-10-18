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