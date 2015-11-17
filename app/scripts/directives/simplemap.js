'use strict';
/*global google, address*/
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:simplemap
 * @description
 * # simplemap
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('simpleMap', ['d3Service','mapService','dataConfig', '$timeout', 'mapInitializer', function (d3Service, mapService, dataConfig, $timeout, mapInitializer) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            console.log(element);
            scope.initPage = function(){
                console.log('Done loading google map');
            };

           
            
            var map;
            scope.aptList = [];

            mapInitializer.mapsInitialized.then(function(){ 
                var myOptions = {
                    zoom: 13,
                    center: new google.maps.LatLng(40.43, -86.92),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = mapService.initmap(attrs.id, myOptions);
                var q = dataConfig.getAptData();
                scope.aptMarkers = [];
                q.then(function(aptJson){
                    for (var i = 0; i < aptJson.length; i ++) {
                        var marker = mapService.createMarker(aptJson[i].address,aptJson[i].lat, aptJson[i].lng, aptJson[i], 'home-2.png', 100, 'apartment',scope.aptMarkers, aptJson[i].rent);
                        console.log(marker);
                        aptJson[i].score = Math.random() * (100 - 0) + 0;
                        aptJson[i].marker = marker;
                        aptJson[i].expand = false;
                        scope.aptList.push(aptJson[i]);   
                    }

                }, function(){});
            });
            
            //mapService.geocodeAddress("purdue police department west lafayette","police department");
            //mapService.showPoliceDept(40.43, -86.92);
            
            //console.log(map);
            //dataConfig.getCrimeData();
            //dataConfig.getClimateDataTypes();
            
        }
    };
  }]);
