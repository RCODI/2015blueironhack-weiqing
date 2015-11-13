'use strict';

/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:simplemap
 * @description
 * # simplemap
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('simpleMap', ['d3Service','mapService', function (d3Service, mapService) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            console.log(element);
            
            var myOptions = {
                zoom: 13,
                center: new google.maps.LatLng(40.43, -86.92),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = mapService.initmap(attrs.id, myOptions);
            mapService.createMarker("asas", 40.43, -86.92, "test");
            
        }
    };
  }]);
