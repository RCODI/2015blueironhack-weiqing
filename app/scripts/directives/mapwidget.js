'use strict';

/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:mapWidget
 * @description
 * # mapWidget
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('mapWidget', function (d3Service, mapService, usSpinnerService) {
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
        		//set spinner
        		usSpinnerService.spin('map-spinner');
        		$scope.spinneractive = true;
        		//callback for deferred promise
        		var promise = mapService.showPlaces(40.43, -86.92, factor.markers, factor.value);
        		promise.then(function(res){
        			usSpinnerService.stop('map-spinner');
        			$scope.spinneractive = false;
        		}, function(error){
        			usSpinnerService.stop('map-spinner');
        			$scope.spinneractive = false;
        		});
        	}
        	else {
        		mapService.clearMarkers(factor.markers);
        	}
        	factor.toggle = !factor.toggle;
        	
        };
	  }

    };
  });
