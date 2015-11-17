'use strict';
/*global google, alert, bedroom, rent, bath, area, address, _  */
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
									{name:'Show Parks', value:'park', markers:[], toggle:false},
									{name:'Show Restaurants', value:'restaurant', markers:[], toggle:false},
									{name:'Show High Schools', value:'high school', markers:[], toggle:false},
									{name:'Show Hospitals', value:'hospital', markers:[], toggle:false},
									{name:'Show Fire Stations', value:'fire station', markers:[], toggle:false}];

		$scope.crimeMonthList = [{name:'Nov', abbr:'nov', value:'crime', markers:[], toggle:false},
									{name:'Oct', abbr:'oct', value:'crime',markers:[], toggle:false},
									{name:'Sept', abbr:'sept', value:'crime', markers:[], toggle:false}];
		$scope.crimeMonth = '';

	  	$scope.toggleMarker = function(factor, month){
        	
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
	        		promise = dataConfig.getCrimeData(month);
	        		promise.then(function(crimeData){
	        			for (var i = 0; i < crimeData.length; i++) {
	        				//console.log(crimeData[i]);
					      mapService.createMarker(crimeData[i].address, crimeData[i].lat, crimeData[i].lng, crimeData[i], 'crimescene.png', 0, 'crime', factor.markers);
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
        		factor.markers = [];
        		console.log(factor.markers);
        	}
        	factor.toggle = !factor.toggle;
        	
        };
        
        $scope.heatMap = null;

        $scope.showHeatMap = function(){
        	if (!$scope.heatMap) {
        		var promise = dataConfig.getCrimeData();
	        	var locationCoords = [];
		        promise.then(function(crimeData){
		        	for (var i = 0; i < crimeData.length; i++) {
		        		locationCoords.push(new google.maps.LatLng(crimeData[i].lat, crimeData[i].lng));
					}
					var pointArray = new google.maps.MVCArray(locationCoords);
					var heatMap = new google.maps.visualization.HeatmapLayer({data: pointArray});
					var map = mapService.getmap();
					heatMap.set('radius',100);
					heatMap.set('maxIntensity', 70);
					heatMap.setMap(map);
					$scope.heatMap = heatMap;
		        });
        	}else{
        		$scope.heatMap.setMap(null);
        		$scope.heatMap = null;
        	}

        	
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
        $scope.expandApt = '';
        $scope.rentMin = 0;
        $scope.rentMax = 5000;


        $scope.refineList = function(type, value){
        	console.log(type);
        	if (type === 'price') {
        		for (var apt in $scope.aptList) {
        			
        			var rent = parseFloat($scope.aptList[apt].rent.replace('$',''));
        			console.log($scope.aptList[apt]);
        			if (!(rent > $scope.rentMin && rent < $scope.rentMax)) {
        				$scope.aptList[apt].marker.marker.setMap(null);
        				$scope.aptList[apt].hide = true;
        			}else {
        				$scope.aptList[apt].marker.marker.setMap(mapService.getmap());
        				$scope.aptList[apt].hide = false;
        			}
        		}
        	}

        };

        $scope.hover = function(apt){
        	var infowindow = mapService.getInfoWindow();
        	var map = mapService.getmap();
        	infowindow.setContent(apt.marker.infoContent);
        	infowindow.open(map, apt.marker.marker);
        	infowindow.maxWidth=200;
        };

        $scope.hoverIn = function(apt){
        	var infowindow = mapService.getInfoWindow();
        	var map = mapService.getmap();
        	infowindow.setContent(apt.marker.infoContent);
        	infowindow.open(map, apt.marker.marker);
        	infowindow.maxWidth=200;
        	console.log(apt);
        	apt.expand = true;
        	//$scope.expandApt = apt.link;
		};

		$scope.hoverOut = function(apt){
		    //$scope.hoverEdit = '';
		    apt.expand = false;
		};

	  }

    };
  });
