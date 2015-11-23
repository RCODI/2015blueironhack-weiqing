'use strict';
/*global google, address*/
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:simplemap
 * @description
 * # simplemap
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('simpleMap', ['d3Service','mapService','dataConfig', '$timeout', 'mapInitializer', '$rootScope', function (d3Service, mapService, dataConfig, $timeout, mapInitializer, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            //console.log(element);
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

                    var maxScore = {
                            CRI: 0,
                            RP: 0,
                            SC: 0,
                            PA: 0,
                            RES: 0,
                            SQFT: 0
                        };

                    for (var i = 0; i < aptJson.length; i ++) {
                        var marker = mapService.createMarker(aptJson[i].address,aptJson[i].lat, aptJson[i].lng, aptJson[i], 'home-2.png', 100, 'apartment',scope.aptMarkers, aptJson[i].rent);
                        //console.log(marker);
                        aptJson[i].score = {
                            CRI: Math.floor(Math.random() * (100 - 0) + 0),
                            RP: Math.floor(Math.random() * (100 - 0) + 0),
                            SC: Math.floor(Math.random() * (100 - 0) + 0),
                            PA: Math.floor(Math.random() * (100 - 0) + 0),
                            RES: Math.floor(Math.random() * (100 - 0) + 0),
                            SQFT: Math.floor(Math.random() * (100 - 0) + 0),
                        };

                        aptJson[i].weight = {
                            CRI: 1,
                            RP: 1,
                            SC: 1,
                            PA: 1,
                            RES: 1,
                            SQFT: 1
                        };

                        var keys =  Object.keys(aptJson[i].score);
                        var a = 0;
                        var b = 0;
                        for (var j = 0; j<keys.length; j++) {
                            if (aptJson[i].score[keys[j]] > maxScore[keys[j]]) {
                                maxScore[keys[j]] = aptJson[i].score[keys[j]];
                            }
                            a += aptJson[i].score[keys[j]] * aptJson[i].weight[keys[j]];
                            b += aptJson[i].weight[keys[j]];
                        }
                        //console.log(keys);

                        aptJson[i].score.total = Math.floor((a*1.0)/b);

                        aptJson[i].marker = marker;
                        aptJson[i].expand = false;
                        scope.aptList.push(aptJson[i]);   
                    }


                    for (var _i = 0; _i < aptJson.length; _i ++) {
                        var _keys =  Object.keys(maxScore);
                        for (var _j = 0; _j<_keys.length; _j++) {
                            aptJson[_i].score[_keys[_j]] = Math.floor((aptJson[_i].score[_keys[_j]]*1.0)/ maxScore[_keys[_j]]*100);
                        }
                    }

                    $rootScope.$broadcast('apt-list-load-end');

                }, function(){});
            });
            
            //mapService.geocodeAddress("purdue police department west lafayette","police department");
            //mapService.showPoliceDept(40.43, -86.92);
            
            //console.log(map);
            //dataConfig.getCrimeData();

            //'datatypeid': 'mly-tmin-normal',
            //'datatypeid': 'mly-tmax-normal',
            //'datatypeid': 'mly-tavg-normal',
            //'datatypeid': 'mly-prcp-normal',
            //dataConfig.getClimateData('2010');
            
        }
    };
  }]);
