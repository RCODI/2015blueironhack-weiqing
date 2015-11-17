'use strict';

/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.mapInitializer
 * @description
 * # mapInitializer
 * Factory in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .factory('mapInitializer', function ($window, $q) {
     // maps loader deferred object
        var mapsDefer = $q.defer();

       
        // Google's url for async maps initialization accepting callback function
        var asyncUrl = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCdl8YQDKfUE3XU0aeLcJACJAVxDYL04Ss&libraries=places,visualization&callback=';
        // async loader
        var asyncLoad = function(asyncUrl, callbackName) {
          var script = document.createElement('script');
          //script.type = 'text/javascript';
          script.src = asyncUrl + callbackName;
          document.body.appendChild(script);
        };

        var loadScript = function(url, callback)
        {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        };


        // callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = function () {
          var markerLib = 'http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/src/markerwithlabel.js';
          loadScript(markerLib, function(){mapsDefer.resolve();});
          
        };

        // loading google maps
        asyncLoad(asyncUrl, 'googleMapsInitialized');

        return {

            // usage: Initializer.mapsInitialized.then(callback)
            mapsInitialized : mapsDefer.promise
        };
  });
