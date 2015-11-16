'use strict';
/*global google, address*/
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:simplemap
 * @description
 * # simplemap
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('simpleMap', ['d3Service','mapService','dataConfig', '$timeout', function (d3Service, mapService, dataConfig, $timeout) {
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
            //mapService.geocodeAddress("purdue police department west lafayette","police department");
            //mapService.showPoliceDept(40.43, -86.92);
            var q = dataConfig.getAptData();

            q.then(function(aptJson){
                for (var i = 0; i < aptJson.length; i ++) {
                    mapService.createMarker(aptJson[i].address,aptJson[i].lat, aptJson[i].lng, aptJson[i], 'home-2.png', 100, 'apartment');
                }

            }, function(){});
            //console.log(map);
            dataConfig.getCrimeData();
            dataConfig.getClimateDataTypes();
            
        }
    };
  }]);
