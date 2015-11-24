'use strict';
/*global google, alert, bedroom, rent, bath, area, address, _  */
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:mapWidget
 * @description
 * # mapWidget
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('mapWidget', function (d3Service, mapService, usSpinnerService, dataConfig, $window, $timeout) {
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
      	$scope.displayFloodLayer = false;
      	$scope.floodLayer = null;

      	$scope.toggleFlood = function(){
      		
      		if ($scope.displayFloodLayer === false){
      			$scope.displayFloodLayer = true;
	      		$scope.floodLayer = new google.maps.KmlLayer({
				    url: 'https://raw.githubusercontent.com/RCODI/2015blueironhack-weiqing/master/app/data/p15nfzc_gF.kml',
				    map: mapService.getmap()
				});
      		}else{
      			$scope.displayFloodLayer = false;
      			$scope.floodLayer.setMap(null);
      		}
      		


      	};

      	$scope.yearSelectOptions = [
      		{text:'2014', value:'2014'},
      		{text:'2013', value:'2013'},
      		{text:'2012', value:'2012'},
      		{text:'2011', value:'2011'},
      		{text:'2010', value:'2010'},
      	];
      	$scope.yearSelectSelected = {text:'Select a year...', value:null};


      	$scope.climate = {
      	  labels :['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September', 'November', 'December'],
		  series :['MAX TMP (°F)', 'AVG TMP (°F)', 'MIN TMP (°F)', 'PRECIP (IN)'],
		  data : [
		    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		  ]
		};

		$scope.updateClimateChart = function(){
			usSpinnerService.spin('map-spinner');
        	$scope.spinneractive = true;
			var year = $scope.yearSelectSelected.value;
			if (!!year) {
				var d = dataConfig.getClimateDataTypes(year);
				d.then(function(data){
					if (!!data.results){
						console.log(data.results);
						var res = [];
						//'MMNT','MMXT','MNTM','TPCP
						var tmp;
						tmp = _.pluck(_.where(data.results, {datatype: 'MMXT'}),'value');
						tmp = _.map(tmp, function(num){return num/10.0 * 1.8 + 32;});
						res.push(tmp);
						tmp = _.pluck(_.where(data.results, {datatype: 'MNTM'}),'value');
						tmp = _.map(tmp, function(num){return num/10.0 * 1.8 + 32;});
						res.push(tmp);
						tmp = _.pluck(_.where(data.results, {datatype: 'MMNT'}),'value');
						tmp = _.map(tmp, function(num){return num/10.0 * 1.8 + 32;});
						res.push(tmp);
						tmp = _.pluck(_.where(data.results, {datatype: 'TPCP'}),'value');
						tmp = _.map(tmp, function(num){return num/1000.0;});
						res.push(tmp);
						
						
						
						$scope.climate.data = res;
					}
					else{
						alert('Empty data from NOAA');
					}
					usSpinnerService.stop('map-spinner');
        			$scope.spinneractive = false;
				}, function(){alert('Error loading data');

					usSpinnerService.stop('map-spinner');
        			$scope.spinneractive = false;
				});
			}
		};


      	$scope.factorMarkerOn = false;
      	$scope.bedroomSelectOptions = [
      		{text:'0+ Bedrooms', value:0},
      		{text:'1+ Bedrooms', value:1},
      		{text:'2+ Bedrooms', value:2},
      		{text:'3+ Bedrooms', value:3},
      		{text:'4+ Bedrooms', value:4},
      		{text:'5+ Bedrooms', value:5}
      	];
      	$scope.bedroomSelectSelected = {text:'Bedroom', value:null};

      	$scope.bathroomSelectOptions = [
      		{text:'1+ Bathrooms', value:1},
      		{text:'2+ Bathrooms', value:2},
      		{text:'3+ Bathrooms', value:3},
      		{text:'4+ Bathrooms', value:4},
      		{text:'5+ Bathrooms', value:5}
      	];
      	$scope.bathroomSelectSelected = {text:'Bathroom', value:null};



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

		$scope.sideBarSort = {
			sortTypes: [{text:'Price', value:'rent'},{text:'Score', value:'score'}],
			sortType: 'rent', // set the default sort type
  			sortReverse: false,  // set the default sort order
  			sortValueFunction: function(apt){
  				if ($scope.sideBarSort.sortType === 'rent') {
  					return parseFloat(apt.rent.replace('$',''));
  				}
  				if ($scope.sideBarSort.sortType === 'score') {
  					return apt.score.total;
  				}
  			}
		};
		$scope.moreFilter = false;
		$scope.safetySlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }

			        }
		};
		$scope.priceSlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }
			        }
		};
		$scope.schoolSlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }
			        }
		};
		$scope.parkSlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }
			        }
		};
		$scope.restSlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }
			        }
		};
		$scope.areaSlider = {
			        value: 0,
			        options: {
			        	hideLimitLabels: true,
			        	showSelectionBar: true,
			            ceil: 100,
			            floor: 0,
			            step: 1,
			            onEnd: function () {
			                $scope.refineList(true);
			            }
			        }
		};
		
		

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

        $scope.showDistanceSlider = false;

        $scope.searchPlace = function(){
        	console.log($scope.queryMarkers);
        	//$scope.queryName = $scope.queryName.replace('United States', '');
        	if ($scope.queryName.length >= 1) {
	        	if ($scope.queryMarkers.length !== 0) {
	        		$scope.showDistanceSlider = false;
	        		mapService.clearMarkers($scope.queryMarkers);
	        	}
	        	var circle = new google.maps.Circle({
		            map: mapService.getmap(),
		            clickable: false,
		            // metres
		            radius: 1000,
		            fillColor: '#fff',
		            fillOpacity: 0.6,
		            strokeColor: '#313131',
		            strokeOpacity: 0.4,
		            strokeWeight: 0.8
		        });
	        	$scope.queryMarkers = mapService.addAddressMarkers([{address: $scope.queryName}], circle);
        		$scope.showDistanceSlider = true;
        		$timeout(function(){
        			$scope.updateDistanceSlider();
        		}, 1000);
        	}
        };


        $scope.expandApt = '';
        var bounds = null;
        $scope.sliderDistance = {
	        value: 15,
	        options: {
	        	hideLimitLabels: true,
	        	showSelectionBar: true,
	            ceil: 100,
	            floor: 0,
	            step: 0.1,
	            translate: function (value) {
	                return value/10.0 + ' miles';
	            },
	            onEnd: function () {
	            	$scope.updateDistanceSlider();
	            	
	            }
	        }
	    };

	    $scope.updateDistanceSlider = function() {
	    	if ($scope.queryMarkers.length === 1 && !!$scope.queryMarkers[0].circleBinded) {
	            		console.log($scope.queryMarkers);
	            		$scope.queryMarkers[0].circleBinded.setRadius($scope.sliderDistance.value*150);
	            		var zoomLevel = Math.floor(16-$scope.sliderDistance.value/10);
	            		zoomLevel = zoomLevel > 16 ? 16 : zoomLevel;
	            		zoomLevel = zoomLevel < 12 ? 12 : zoomLevel;
	            		mapService.getmap().setZoom(zoomLevel);
	            		mapService.getmap().setCenter($scope.queryMarkers[0].getPosition());
	            	
	            		bounds = $scope.queryMarkers[0].circleBinded.getBounds();
	            		$scope.refineList();
	        }
	    };

	    $scope.zoomIn = function(marker) {
	    	mapService.getmap().setZoom(15);
	        mapService.getmap().setCenter(marker.getPosition());
	    };

	    $scope.clearDistanceSlider = function() {
	    	if ($scope.queryMarkers.length !== 0) {
	        	$scope.showDistanceSlider = false;
	        	mapService.clearMarkers($scope.queryMarkers);
	        }
	        $scope.queryName = '';
	        bounds = null;
	        mapService.getmap().setZoom(13);
	        $scope.refineList();
	    };

        $scope.sliderScore = {
	        minValue: 10,
	        maxValue: 60,
	        options: {
	        	hideLimitLabels: true,
	            ceil: 100,
	            floor: 0,
	            translate: function (value) {
	                return value;
	            },
	            onEnd: function () {
	                $scope.refineList();
	            }
	        }
	    };

        $scope.sliderTranslate = {
	        minValue: 100,
	        maxValue: 800,
	        options: {
	        	hideLimitLabels: true,
	            ceil: 1000,
	            floor: 0,
	            translate: function (value) {
	            	if (value >= 1000) {
	            		return '$1000+';
	            	}
	                return '$' + value;
	            },
	            onEnd: function () {
	                //console.log($scope.sliderTranslate.minValue , $scope.sliderTranslate.maxValue );
	                if ($scope.sliderTranslate.maxValue >= 1000) {
	                	$scope.sliderTranslate.maxValue = 9999;
	                }
	            	$scope.refineList();
	            }
	        }
	    };

	    $scope.$on('apt-list-load-end', function(event, args) {

		    updateRentHist($scope.aptList);
		    
		    
		});

	    $scope.showHist = true;

		var updateRentHist = function() {
			$scope.showHist = true;
			var tmpAptList = _.filter($scope.aptList, function(apt){
				//maybe move these conditions to function duplicate code in refinelist function
				var bedroomMin = $scope.bedroomSelectSelected.value;
	        	var bathroomMin = $scope.bathroomSelectSelected.value;
	        	var bed = parseFloat(apt.bedroom.replace(/[A-Za-z]/, ''));
        		bed = !bed ? 0 : Math.floor(bed);
        		var bath = parseFloat(apt.bath.replace(/[A-Za-z]/, ''));
        		bath = !bath ? 0 : Math.floor(bath);

        		var bedCond = !bedroomMin ? true : bed >= bedroomMin;
				var bathCond = !bathroomMin ? true:  bath >= bathroomMin;

				return bedCond && 
						bathCond && 
						apt.score.CRI >= $scope.safetySlider.value &&
        				apt.score.RP >= $scope.priceSlider.value &&
        				apt.score.SC >= $scope.schoolSlider.value &&
        				apt.score.PA >= $scope.parkSlider.value &&
        				apt.score.RES >= $scope.restSlider.value &&
        				apt.score.SQFT >= $scope.areaSlider.value;
			});

			if (tmpAptList.length === 0) {
				$scope.showHist = false;
				return;
			}

			var min = _.min(tmpAptList, function(apt){
		    	return parseFloat(apt.rent.replace('$',''));
		    });

		    var max = _.max(tmpAptList, function(apt){
		    	return parseFloat(apt.rent.replace('$',''));
		    });

		    var _minValue = parseFloat(min.rent.replace('$','')) - 1;
		    var _maxValue = parseFloat(max.rent.replace('$','')) + 1;

		    //$scope.sliderTranslate.options.floor = _minValue > 0 ? _minValue : 0;
		    //$scope.sliderTranslate.options.ceil = parseFloat(max.rent.replace('$',''))+1;
		    
		    //$scope.sliderTranslate.minValue = _minValue > 0 && _minValue < 800 ? _minValue : 0;
		    //$scope.sliderTranslate.maxValue = _maxValue < 1000 ? _maxValue : 800;

		    $scope.refineList();

		    var dist = _.groupBy(tmpAptList, function(apt){ 
		    	var rent = parseFloat(apt.rent.replace('$',''));
		    	rent = Math.floor(rent / 100);
		    	return rent; 
		    });
		    
		    var tmp = _.sortBy(Object.keys(dist), function(num){ return parseInt(num);});
		   	
		   	var e = document.getElementById('rent-slider');
			$scope.histStep = parseInt(window.getComputedStyle(e, null).getPropertyValue('width').replace('px',''))/10;
		    

		    function newFilledArray(length, val) {
			    var array = [];
			    for (var i = 0; i < length; i++) {
			        array[i] = {
			        	value:val,
			        };
			    }
			    return array;
			}

		    $scope.rentHistData = newFilledArray(10, 0);
		    var shift = 5;
		    
		    for (var i = 0; i<tmp.length; i++) {
		    	if (tmp[i] < 10){
		    		$scope.rentHistData[tmp[i]].value = dist[tmp[i]].length+shift;
		    	}else{
		    		$scope.rentHistData[9].value += dist[tmp[i]].length;
		    	}
		    }
		    $scope.rentHistData[9].value += shift;
		    console.log($scope.histStep);
		};


		//for window resize
		var w = angular.element($window);
        $scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
            var e = document.getElementById('rent-slider');
			$scope.histStep = parseInt(window.getComputedStyle(e, null).getPropertyValue('width').replace('px',''))/10;
        }, true);

        w.bind('resize', function () {
            $scope.$apply();
        });


	    $scope.getAptListLength = function() {
	    	return _.filter($scope.aptList, function(apt){ return !apt.hide; }).length;
	    };

        $scope.refineList = function(refreshHist){
        	//console.log(type);
        	var rentRange = {rentMin: $scope.sliderTranslate.minValue,
	            			rentMax: $scope.sliderTranslate.maxValue };

	        var bedroomMin = $scope.bedroomSelectSelected.value;
	        var bathroomMin = $scope.bathroomSelectSelected.value;
	        //console.log(bedroomMin, bathroomMin);
        	if (true) {
        		for (var apt in $scope.aptList) {
        			var rent = parseFloat($scope.aptList[apt].rent.replace('$',''));
        			var bed = parseFloat($scope.aptList[apt].bedroom.replace(/[A-Za-z]/, ''));
        			bed = !bed ? 0 : Math.floor(bed);
        			var bath = parseFloat($scope.aptList[apt].bath.replace(/[A-Za-z]/, ''));
        			bath = !bath ? 0 : Math.floor(bath);
        			
        			//console.log(bed, bath);
        			var bedCond = !bedroomMin ? true : bed >= bedroomMin;
        			var bathCond = !bathroomMin ? true:  bath >= bathroomMin;

        			var latLngMarker = new google.maps.LatLng($scope.aptList[apt].marker.marker.position.lat(),
        			 										  $scope.aptList[apt].marker.marker.position.lng());
        			var boundCond = !bounds ? true: bounds.contains(latLngMarker);
        			
        			/*		CRI: 1,
                            RP: 1,
                            SC: 1,
                            PA: 1,
                            RES: 1,
                            SQFT: 1

                    */
        			//console.log(bedCond, bathCond);
        			if (
        				!(rent > rentRange.rentMin &&
        				  rent < rentRange.rentMax) ||
        				  !bedCond ||
        				  !bathCond ||
        				  !boundCond || 
        				  $scope.aptList[apt].score.CRI < $scope.safetySlider.value ||
        				  $scope.aptList[apt].score.RP < $scope.priceSlider.value ||
        				  $scope.aptList[apt].score.SC < $scope.schoolSlider.value ||
        				  $scope.aptList[apt].score.PA < $scope.parkSlider.value ||
        				  $scope.aptList[apt].score.RES < $scope.restSlider.value ||
        				  $scope.aptList[apt].score.SQFT < $scope.areaSlider.value
        				) {
        				$scope.aptList[apt].hide = true;
        				if (!!boundCond) {
        					$scope.aptList[apt].marker.marker.setMap(null);
        				}
        			}else {
        				$scope.aptList[apt].marker.marker.setMap(mapService.getmap());
        				$scope.aptList[apt].hide = false;
        			}
        		}
        	}

        	if (!!refreshHist) {
        		updateRentHist();
        	}

        };

        $scope.hover = function(apt){
        	var infowindow = mapService.getInfoWindow();
        	var map = mapService.getmap();
        	infowindow.setContent(apt.marker.infoContent);
        	infowindow.open(map, apt.marker.marker);
        	infowindow.maxWidth=200;
        	mapService.getmap().setZoom(13);

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
