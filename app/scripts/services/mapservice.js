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

    // AngularJS will instantiate a singleton by calling "new" on this function
    service.createMarker = function(add,lat,lng,headMarker) {
	   var contentString = add;
	   var headString = headMarker;	
	   var marker = new google.maps.Marker({
	     position: new google.maps.LatLng(lat,lng),
	     map: map,
	     draggable:true,
	    animation: google.maps.Animation.DROP,

	           });

	  google.maps.event.addListener(marker, 'click', function() {
	     infowindow.setContent('<h1 class="header1"> Information about marker</h1>' + 
	    '<h2 class="header1" > Event name: ' + headString + '</h2>' +
	    '<h2 class="header1" > Location:' + contentString + '</h2>');
	     infowindow.open(map,marker);
	     infowindow.maxWidth=200;
	   });

	   bounds.extend(marker.position);

	 };

	 service.initmap = function(id, myOptions){
	 	map = new google.maps.Map(document.getElementById(id), myOptions)
	 };

	 service.setmap = function(_map){
	 	map = _map;	
	 };

	 service.getmap = function(){
	 	return map;
	 };

	 return service;

  });
