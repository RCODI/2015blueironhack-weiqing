'use strict';
/*global google, alert, bedroom, rent, bath, area, address, MarkerWithLabel  */
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
            
    var infowindow;

    var geocoder; 
  	
    var searchPlaces;

    var iconBase = 'https://raw.githubusercontent.com/RCODI/2015blueironhack-weiqing/master/app/images/mapiconscollection-markers/';

    var markers = [];

    function setMapOnMarkers(map, markers) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        if (!!markers[i].circleBinded) {
            markers[i].circleBinded.setMap(map);
        }
      }
    }

    // AngularJS will instantiate a singleton by calling "new" on this function
    service.createMarker = function(address,lat,lng,headMarker,iconImage,zIndex,type, _markers, label, circle) {
	    var contentString = address;
        var iconUrl = null;
        if (!!iconImage) {
            iconUrl = iconBase + iconImage;
        }
        var marker;
        var markerOption = {
            position: new google.maps.LatLng(lat,lng),
            map: map,
            };

        //animation: google.maps.Animation.DROP,
        if (!!iconUrl) {
            markerOption.icon = iconUrl;
        } 
        if (!!zIndex) {
            markerOption.zIndex = zIndex;
        }
        if (!!label) {
            markerOption.labelAnchor = new google.maps.Point(22, -5);
            markerOption.labelClass = 'map-label'; // the CSS class for the label
            markerOption.labelStyle = {opacity: 1};
            markerOption.labelContent = label;
            marker = new MarkerWithLabel(markerOption);

        }else {
            marker = new google.maps.Marker(markerOption);
         
        }

        if (!!circle) {
            circle.bindTo('center', marker, 'position');
            marker.circleBinded = circle;
            map.setZoom(14);
            map.setCenter(marker.getPosition());
        }
	    
        if(!!_markers) {
            _markers.push(marker);
        }
        else{
            markers.push(marker);
        }

        var infoContent = '';

        if (type === 'apartment') {
            infoContent = '<h6 class="header1"> ' + '<a href=' + headMarker.link + ' target=\'_blank\'>' + address + '</a> ' + headMarker.rent + '</h6>' + 
                '<h6 class="header1" >' + headMarker.bedroom + ' ' + headMarker.bath + '</h6>' +
                //'<h6 class="header1" > Rent: ' + headMarker.rent + '</h6>'+ 
                '<h6 class="header1" > Area: ' + headMarker.area + '</h6>'+ 
                //'<h6 class="header1" > Link: ' + '<a href=\'' + headMarker.link +' \' target=\'_blank\'>' + headMarker.link + '</a></h6>'
                '';

    	  	google.maps.event.addListener(marker, 'click', function() {
    		     infowindow.setContent(infoContent);
                 infowindow.open(map,marker);
    		     infowindow.maxWidth=200;
    	   	});
        }
        else if (type === 'crime') {
            infoContent = '<h6 class="header1"> ' + headMarker.address + '</h6>' + 
                '<h6 class="header1" >' + headMarker.type + '</h6>' +
                '<h6 class="header1" > Date: ' + headMarker.date + '</h6>'+ 
                '<h6 class="header1" > Department: ' + headMarker.dept + '</h6>';

            google.maps.event.addListener(marker, 'click', function() {
                 infowindow.setContent(infoContent);
                 infowindow.open(map,marker);
                 infowindow.maxWidth=200;
            }); 
        }
        else {
            infoContent = address;

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(address);
                infowindow.open(map, marker);
            });
        }

        return {marker:marker, infoContent: infoContent};
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
    service.addAddressMarkers = function(addrs, circle) {
        var _markers = [];
        service.nextAddress(0, addrs, 100, _markers, circle);
        return _markers;
    };

    //should be private functions below

    service.nextAddress = function(i, addrs, delay, _markers, circle){

        //delay = delay > 50 ? 50 : delay;
        console.log(delay);
        if (i < addrs.length) {
            $timeout(function() {
                service.geocodeAddress(addrs[i].address + ' West Lafayette, IN', addrs[i],i , addrs, delay, _markers, circle);
            }, delay);
            
        }
    };

    //do not use this one, should be private

    service.geocodeAddress = function(address, headerdesp, index, addrs, delay, _markers, circle) {

	    geocoder.geocode({address:address}, function (results,status)
	      { 
		    if (status === google.maps.GeocoderStatus.OK) {
		        for (var i = 0; i < results.length; i++) {
		        	var p = results[i].geometry.location;
			        var lat=p.lat();
			        var lng=p.lng();
			        service.createMarker(address,lat,lng,headerdesp, null, 101, null, _markers, null, circle);
		            break;
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
        //map.setOptions({styles: dataConfig.getMapStyle()});
	 	searchPlaces = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow();

        geocoder = new google.maps.Geocoder(); 
        return map;
	 };

	 service.setmap = function(_map){
	 	map = _map;	
	 };

	 service.getmap = function(){
	 	return map;
	 };

     service.getInfoWindow = function(){
        return infowindow;
     };

	 return service;

  });
