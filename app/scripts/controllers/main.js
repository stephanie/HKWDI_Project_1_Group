'use strict';

angular.module('tickeyApp')
.controller('MainCtrl', function ($scope, $rootScope, localStorageService) {
    
    $scope.name = "Tickety";
    $rootScope.howButton = false;
    $rootScope.smallPlaybutton = true;

  });