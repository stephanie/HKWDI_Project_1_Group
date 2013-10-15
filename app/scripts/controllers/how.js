'use strict';

angular.module('tickeyApp')
.controller('HowCtrl', function ($scope, $rootScope) {
    
    $scope.name = "Tickety";
    $rootScope.howButton = true;
    $rootScope.smallPlaybutton = false;
  });