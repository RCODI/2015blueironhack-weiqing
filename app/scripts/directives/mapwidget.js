'use strict';
/*global google, alert, bedroom, rent, bath, area, address  */
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:mapWidget
 * @description
 * # mapWidget
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('mapWidget', function (d3Service, mapService, usSpinnerService, dataConfig) {
    return {
      templateUrl: 'views/mapwidget.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the mapWidget directive');
        //var input = element[0].querySelector('#query-input');
        //console.log(element[0]);
        //var autocomplete = new google.maps.places.Autocomplete(input);

      },
      controller: function($scope, $element){


      	$scope.factorMarkerOn = false;
		$scope.widgetFactorList = [{name: 'Show Police Departments',value:'police', markers:[], toggle:false},
									{name:'Show Crimes', value:'crime', markers:[], toggle:false},
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
        		var promise;
        		if (factor.value !== 'crime') {
	        		promise = mapService.showPlaces(40.43, -86.92, factor.markers, factor.value);
	        		promise.then(function(res){
	        			usSpinnerService.stop('map-spinner');
	        			$scope.spinneractive = false;
	        		}, function(error){
	        			usSpinnerService.stop('map-spinner');
	        			$scope.spinneractive = false;
	        		});
	        	}
	        	else {
	        		promise = dataConfig.getCrimeData();
	        		promise.then(function(crimeData){
	        			for (var i = 0; i < crimeData.length; i++) {
	        				console.log(crimeData[i]);
					      mapService.createMarker(crimeData[i].Address, crimeData[i].lat, crimeData[i].lng, crimeData[i], 'crimescene.png', 50, 'crime', factor.markers);
					    }
					    usSpinnerService.stop('map-spinner');
	        			$scope.spinneractive = false;
	        		}, function(){
	        			usSpinnerService.stop('map-spinner');
	        			$scope.spinneractive = false;
	        		});
	        		
	        	}
        	}
        	else {
        		mapService.clearMarkers(factor.markers);
        	}
        	factor.toggle = !factor.toggle;
        	
        };

        $scope.queryMarkers = [];
        $scope.queryName = '';
        $scope.paOptions = {
        	updateModel:true
        };

        $scope.searchPlace = function(){
        	console.log($scope.queryName);
        	//$scope.queryName = $scope.queryName.replace('United States', '');
        	if ($scope.queryName.length >= 1) {
	        	if ($scope.queryMarkers.length !== 0) {
	        		mapService.clearMarkers($scope.queryMarkers);
	        	}
	        	$scope.queryMarkers = mapService.addAddressMarkers([{address: $scope.queryName}]);
        	}
        };
	  }

    };
  });
