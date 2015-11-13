'use strict';

/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.mapService
 * @description
 * # mapService
 * Service in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .factory('mapService', function () {
  	var service = {};

    var map;
            
  	var infowindow = new google.maps.InfoWindow();

  	var geocoder = new google.maps.Geocoder(); 
  	
  	var searchPlaces;

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

	  google.maps.event.addListener(marker, 'click', function() {
	     infowindow.setContent('<h6 class="header1"> Information about marker</h6>' + 
	    '<h6 class="header1" > Event name: ' + headString + '</h6>' +
	    '<h6 class="header1" > Location:' + contentString + '</h6>');
	     infowindow.open(map,marker);
	     infowindow.maxWidth=200;
	   });


	 };


	service.createPoliceDeptMarker = function(place) {
	  var placeLoc = place.geometry.location;
	  var marker = new google.maps.Marker({
	    map: map,
	    position: place.geometry.location
	  });

	  google.maps.event.addListener(marker, 'click', function() {
          searchPlaces.getDetails(place, function(result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }
            infowindow.setContent(result.name);
            infowindow.open(map, marker);
          });
        });
	}
	
  	service.showPoliceDept = function(lat, lng){
  		searchPlaces.radarSearch({
		    bounds: new google.maps.LatLngBounds(
       new google.maps.LatLng(lat-0.1, lng-0.1),
       new google.maps.LatLng(lat+0.1, lng+0.1)),
		    keyword: "police"
		}, function callback(results, status) {
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		  	console.log(results);
		    for (var i = 0; i < results.length; i++) {
		      service.createPoliceDeptMarker(results[i]);
		    }
		  }
		});
  	};

	 service.geocodeAddress = function(address, headerdesp) {
	    geocoder.geocode({address:address}, function (results,status)
	      { 
		    if (status == google.maps.GeocoderStatus.OK) {
		        for (var i = 0; i < results.length; i++) {
		        	var p = results[i].geometry.location;
			        var lat=p.lat();
			        var lng=p.lng();
			        service.createMarker(address,lat,lng,headerdesp);
		        }
		        //console.log(results);
	        }
	        else {
	        	if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		        
	          	} else {
	                        
	        	}   
	        }
	      }
	    );
	  };

	 service.initmap = function(id, myOptions){
	 	map = new google.maps.Map(document.getElementById(id), myOptions);
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
