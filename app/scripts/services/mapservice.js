'use strict';
/*global google, alert, bedroom, rent, bath, area, address  */
/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.mapService
 * @description
 * # mapService
 * Service in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .factory('mapService', function ($q, dataConfig, $timeout) {
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
    service.createMarker = function(address,lat,lng,headMarker,iconImage,zIndex,type, _markers) {
	    var contentString = address;
        var iconUrl = null;
        if (!!iconImage) {
            iconUrl = iconBase + iconImage;
        }
        var marker;
        //animation: google.maps.Animation.DROP,
        if (!!iconUrl) {
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map: map,
            icon: iconUrl,
            zIndex: zIndex
            });
        } else {
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map: map,
            });
        }
	    
        if(!!_markers) {
            _markers.push(marker);
        }
        else{
            markers.push(marker);
        }
        if (type === 'apartment') {
    	  	google.maps.event.addListener(marker, 'click', function() {
    		     infowindow.setContent('<h6 class="header1"> ' + address + '</h6>' + 
    		    '<h6 class="header1" >' + headMarker.bedroom + ' ' + headMarker.bath + '</h6>' +
    		    '<h6 class="header1" > Rent: ' + headMarker.rent + '</h6>'+ 
                '<h6 class="header1" > Area: ' + headMarker.area + '</h6>'+ 
                '<h6 class="header1" > Link: ' + '<a href=\'' + headMarker.link +' \' target=\'_blank\'>' + headMarker.link + '</a></h6>');
    		     infowindow.open(map,marker);
    		     infowindow.maxWidth=200;
    	   	});
        }
        else if (type === 'crime') {
            google.maps.event.addListener(marker, 'click', function() {
                 infowindow.setContent('<h6 class="header1"> ' + headMarker.Address + '</h6>' + 
                '<h6 class="header1" >' + headMarker.Type + '</h6>' +
                '<h6 class="header1" > Date: ' + headMarker.Date + '</h6>'+ 
                '<h6 class="header1" > Department: ' + headMarker.dept + '</h6>');
                 infowindow.open(map,marker);
                 infowindow.maxWidth=200;
            }); 
        }
        else {
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(address);
                infowindow.open(map, marker);
            });
        }
	};

    service.clearMarkers = function(_markers){
        setMapOnMarkers(null, _markers);
        _markers = [];
    };

    //only used for place search results and create a marker on map
	service.createCustomMarker = function(place, markers, type) {
        var placeLoc = place.geometry.location;
        var factorNameMap = dataConfig.getFactorTypes();
        var marker = type in factorNameMap ? new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + factorNameMap[type] +'.png',
            opacity: 1,
            zIndex: 1
        }) : new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            opacity: 1,
            zIndex: 1
        });

        markers.push(marker);
        //mouseover
	    google.maps.event.addListener(marker, 'click', function() {
          searchPlaces.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.log(status);
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

    //geo code api service call for other services
    service.addAddressMarkers = function(addrs) {
        var _markers = [];
        service.nextAddress(0, addrs, 100, _markers);
        return _markers;
    };

    //should be private functions below

    service.nextAddress = function(i, addrs, delay, _markers){

        //delay = delay > 50 ? 50 : delay;
        console.log(delay);
        if (i < addrs.length) {
            $timeout(function() {
                service.geocodeAddress(addrs[i].address + ' West Lafayette, IN', addrs[i],i , addrs, delay, _markers);
            }, delay);
            
        }
    };

    //do not use this one, should be private

    service.geocodeAddress = function(address, headerdesp, index, addrs, delay, _markers) {

	    geocoder.geocode({address:address}, function (results,status)
	      { 
		    if (status === google.maps.GeocoderStatus.OK) {
		        for (var i = 0; i < results.length; i++) {
		        	var p = results[i].geometry.location;
			        var lat=p.lat();
			        var lng=p.lng();
			        service.createMarker(address,lat,lng,headerdesp, null, null, null, _markers);
		        }
		        //console.log(results);
                index ++;
	        }
	        else {
	        	if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		          //alert(status);
                  console.log(status);
	          	} else {
	                        
	        	}   
	        }
            service.nextAddress(index, addrs, delay );
	      }
	    );

	  };

	 service.initmap = function(id, myOptions){
	 	map = new google.maps.Map(document.getElementById(id), myOptions);
        map.setOptions({styles: dataConfig.getMapStyle()});
	 	searchPlaces = new google.maps.places.PlacesService(map);
        return map;
	 };

	 service.setmap = function(_map){
	 	map = _map;	
	 };

	 service.getmap = function(){
	 	return map;
	 };

	 return service;

  });
