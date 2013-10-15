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