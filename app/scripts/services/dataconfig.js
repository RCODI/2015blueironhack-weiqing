'use strict';

/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.dataConfig
 * @description
 * # dataConfig
 * Service in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .service('dataConfig', function () {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    //water color #46bcec
    var mapStyles = [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#acbcc9'},{'visibility':'on'}]}];
    var factorTypes = {'police':'police', 'restaurant':'restaurant', 'park':'forest', 'high school':'school', 'fire station':'firemen', 'hospital':'hospital-building'};
    this.getMapStyle = function(){
    	return mapStyles;
    };
    this.getFactorTypes = function(){
    	return factorTypes;
    };

  });
