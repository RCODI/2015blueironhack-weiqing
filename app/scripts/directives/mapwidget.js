'use strict';

/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:mapWidget
 * @description
 * # mapWidget
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('mapWidget', function (d3Service, mapService) {
    return {
      templateUrl: 'views/mapwidget.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the mapWidget directive');

      },
      controller: function($scope, $element){
      	$scope.factorMarkerOn = false;
		$scope.widgetFactorList = [{name: 'Show Police Departments',value:'police', markers:[], toggle:false},
									{name:'Show Parks', value:'park', markers:[], toggle:false},
									{name:'Show Restaurants', value:'restaurant', markers:[], toggle:false},
									{name:'Show High Schools', value:'high school', markers:[], toggle:false},
									{name:'Show Hospitals', value:'hospital', markers:[], toggle:false},
									{name:'Show Fire Stations', value:'fire station', markers:[], toggle:false}];

	  	$scope.toggleMarker = function(factor){
        	
        	if (!factor.toggle) {
        		mapService.showPlaces(40.43, -86.92, factor.markers, factor.value);
        	}
        	else {
        		mapService.clearMarkers(factor.markers);
        	}
        	factor.toggle = !factor.toggle;
        	
        };
	  }

    };
  });
