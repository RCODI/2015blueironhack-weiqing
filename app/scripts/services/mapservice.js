'use strict';
/*global google, alert  */
/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.mapService
 * @description
 * # mapService
 * Service in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .factory('mapService', function ($q, dataConfig) {
  	var service = {};

    var map;
            
    var infowindow = new google.maps.InfoWindow();

    var geocoder = new google.maps.Geocoder(); 
  	
    var searchPlaces;

    var iconBase = 'images/mapiconscollection-markers/';

    var markers = [];

    function setMapOnMarkers(map, markers) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }
    

    // AngularJS will instantiate a singleton by calling "new" on this function
    service.createMarker = function(address,lat,lng,headMarker) {
	   var contentString = address;
	   var headString = headMarker;	
	   var marker = new google.maps.Marker({
	     position: new google.maps.LatLng(lat,lng),
	     map: map,
	     draggable:true,
	    animation: google.maps.Animation.DROP,

	           });

       markers.push(marker);

	  	google.maps.event.addListener(marker, 'click', function() {
		     infowindow.setContent('<h6 class="header1"> Information about marker</h6>' + 
		    '<h6 class="header1" > Event name: ' + headString + '</h6>' +
		    '<h6 class="header1" > Location:' + contentString + '</h6>');
		     infowindow.open(map,marker);
		     infowindow.maxWidth=200;
	   	});


	 };

    service.clearMarkers = function(_markers){
        setMapOnMarkers(null, _markers);
        _markers = [];
    };


	service.createCustomMarker = function(place, markers, type) {
        var placeLoc = place.geometry.location;
        var factorNameMap = dataConfig.getFactorTypes();
        var marker = type in factorNameMap ? new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: iconBase + factorNameMap[type] +'.png'
        }) : new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
        });

        markers.push(marker);

	    google.maps.event.addListener(marker, 'click', function() {
          searchPlaces.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }
            infowindow.setContent(result.name);
            infowindow.open(map, marker);
          });
        });
	};
	
  	service.showPlaces = function(lat, lng, markers, type){
        var deffered = $q.defer();

  		searchPlaces.radarSearch({
		    bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(lat-0.1, lng-0.1),
                new google.maps.LatLng(lat+0.1, lng+0.1)),
		    keyword: type
		}, function callback(results, status) {
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		  	console.log(results);
		    for (var i = 0; i < results.length; i++) {
		      service.createCustomMarker(results[i], markers, type);
		    }
            deffered.resolve('good');
		  }
          else {
            deffered.reject('error');
          }
		});

        return deffered.promise;
  	};

	 service.geocodeAddress = function(address, headerdesp) {
	    geocoder.geocode({address:address}, function (results,status)
	      { 
		    if (status === google.maps.GeocoderStatus.OK) {
		        for (var i = 0; i < results.length; i++) {
		        	var p = results[i].geometry.location;
			        var lat=p.lat();
			        var lng=p.lng();
			        service.createMarker(address,lat,lng,headerdesp);
		        }
		        //console.log(results);
	        }
	        else {
	        	if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		        
	          	} else {
	                        
	        	}   
	        }
	      }
	    );
	  };

	 service.initmap = function(id, myOptions){
	 	map = new google.maps.Map(document.getElementById(id), myOptions);
        map.setOptions({styles: dataConfig.getMapStyle()});
	 	searchPlaces = new google.maps.places.PlacesService(map);
	 };

	 service.setmap = function(_map){
	 	map = _map;	
	 };

	 service.getmap = function(){
	 	return map;
	 };

	 return service;

  });
