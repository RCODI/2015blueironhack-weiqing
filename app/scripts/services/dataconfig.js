'use strict';
// jscs:disable
/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.dataConfig
 * @description
 * # dataConfig
 * Service in the 2015blueironhackWeiqingApp.
 */
angular.module('2015blueironhackWeiqingApp')
  .service('dataConfig', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    //water color #46bcec
    var aptData = [{'area': '400 sq ft', 'address': '1 fowler', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/45096', 'rent': '$435', 'bedroom': '1 Bedroom'}, {'area': '1035 sq ft', 'address': '100 Timber Trail Drive', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/17937', 'rent': '$660', 'bedroom': '2 Bedroom'}, {'area': '637 sq ft', 'address': '100 Tonto Trail', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/41343', 'rent': '$570', 'bedroom': '1 Bedroom'}, {'area': '988 sq ft', 'address': '100 Tonto Trail', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/41344', 'rent': '$670', 'bedroom': '2 Bedroom'}, {'area': '1937 sq ft', 'address': '1000 Northwestern Avenue', 'bath': '2.5 Bath', 'link': 'https://www.boilerapartments.com/listing/30885', 'rent': '$490', 'bedroom': '1 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/4433', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/5703', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/15383', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/15384', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/15426', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '850 sq ft', 'address': '1002 Cincinnati', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/15427', 'rent': '$600', 'bedroom': '2 Bedroom'}, {'area': '2000 sq ft', 'address': '101 Quincy Street', 'bath': '2 Bath', 'link': 'https://www.boilerapartments.com/listing/42174', 'rent': '$2500', 'bedroom': '5 Bedroom'}, {'bath': '3 Bath', 'bedroom': '5 Bedroom', 'link': 'https://www.boilerapartments.com/listing/24256', 'rent': '$2500', 'address': '101 Quincy Street'}, {'area': '1230 sq ft', 'address': '1010 North Salisbury Street', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/30609', 'rent': '$425', 'bedroom': '12 Bedroom'}, {'area': '1800 sq ft', 'address': '1011 N Salisbury St', 'bath': '1.5 Bath', 'link': 'https://www.boilerapartments.com/listing/42214', 'rent': '$1350', 'bedroom': '3 Bedroom'}, {'area': '1009 sq ft', 'address': '1013 Holly Drive', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/38524', 'rent': '$900', 'bedroom': '3 Bedroom'}, {'area': '960 sq ft', 'address': '1015 North 6th Street', 'bath': '2 Bath', 'link': 'https://www.boilerapartments.com/listing/28386', 'rent': '$675', 'bedroom': '3 Bedroom'}, {'area': '1105 sq ft', 'address': '1015 North 6th Street', 'bath': '2 Bath', 'link': 'https://www.boilerapartments.com/listing/28387', 'rent': '$800', 'bedroom': '4 Bedroom'}, {'area': '1070 sq ft', 'address': '102 E Columbia St', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/45409', 'rent': '$495', 'bedroom': '3 Bedroom'}, {'area': '640 sq ft', 'address': '102 East Columbia Street', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/5049', 'rent': '$600', 'bedroom': '1 Bedroom'}, {'area': '460 sq ft', 'address': '102 East Columbia Street', 'bath': '1 Bath', 'link': 'https://www.boilerapartments.com/listing/5050', 'rent': '$600', 'bedroom': '1 Bedroom'}];
    var mapStyles = [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#46bcec'},{'visibility':'on'}]}];
    var factorTypes = {'police':'police', 'restaurant':'restaurant', 'park':'forest', 'high school':'school', 'fire station':'firemen', 'hospital':'hospital-building'};
    this.getMapStyle = function(){
    	return mapStyles;
    };
    this.getFactorTypes = function(){
    	return factorTypes;
    };

    this.sleepFor = function( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
	};
	
	this.getCrimeData = function(_month){
		var deffered = $q.defer();
		var month = !!_month ? '_'+_month:'';
    	$http.get('data/crime'+month+'.json')
	       .then(function(res){
	       		deffered.resolve(res.data);            
	    }, function(){
	    	deffered.reject('error');
	    });
	    return deffered.promise;
	};
	//http://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes
	/*
	{mindate: "1763-01-01", maxdate: "2015-10-01", name: "Monthly Mean minimum temperature", datacoverage: 1, id: "MMNT"}
13{mindate: "1763-01-01", maxdate: "2015-10-01", name: "Monthly Mean maximum temperature", datacoverage: 1, id: "MMXT"}
14{mindate: "1763-01-01", maxdate: "2015-10-01", name: "Monthly mean temperature", datacoverage: 1, id: "MNTM"}
15{mindate: "1857-01-01", maxdate: "2015-10-01", name: "Maximum snow depth", datacoverage: 1, id: "MXSD"}
16{mindate: "1781-01-01", maxdate: "2015-10-01", name: "Total precipitation", datacoverage: 1, id: "TPCP"}
	*/
	this.getClimateDataTypes = function(year){
		var token = 'qBPsNYrWVsgOUvBCrteVjKGkdVqpPfzn';
		var cityId = 'CITY:US180006';
		var deffered = $q.defer();
		var end = new Date();
		var start = new Date(end.getTime()-5*365*24*60*60*1000);

		
		start = year + '-01-01';
		end = year + '-12-31';


		$http.get('http://www.ncdc.noaa.gov/cdo-web/api/v2/data/', {
			headers: {'token': token },
			params: {
					'datasetid' : 'GHCNDMS',
					'locationid' : cityId,
					'limit':100,
					'datatypeid':['MMNT','MMXT','MNTM','TPCP'],
					'startdate'	: start,
					'enddate'	: end,
					'stationid': 'GHCND:USW00014835'
			}
		})
	       .then(function(res){
	       		console.log(res.data);
	       		deffered.resolve(res.data);            
	    }, function(){
	    	deffered.reject('error');
	    });
	    return deffered.promise;
	};

	//http://www.ncdc.noaa.gov/cdo-web/api/v2/data?limit=100&offset=0&datasetid=normal_mly&datatypeid=mly-tmin-normal&datatypeid=mly-tmax-normal&datatypeid=mly-tavg-normal&datatypeid=mly-prcp-normal&stationid=GHCND%3AUSC00124715&startdate=2010-01-01&enddate=2010-12-31
	//http://www.ncdc.noaa.gov/cdo-web/api/v2/data?limit=100&offset=0&datasetid=normal_mly&datatypeid=mly-tmin-normal&datatypeid=mly-tmax-normal&datatypeid=mly-tavg-normal&datatypeid=mly-prcp-normal&stationid=GHCND%3AUSW00014835&startdate=2010-01-01&enddate=2010-12-31
	/* jshint ignore:start */
	this.getClimateData = function(year){
		var token = 'qBPsNYrWVsgOUvBCrteVjKGkdVqpPfzn';
		var cityId = 'CITY:US180006';
		var deffered = $q.defer();
		var start = year + '-01-01';
		var end = year + '-12-31';

		$http.get('http://www.ncdc.noaa.gov/cdo-web/api/v2/data', {
			headers: {'token': 'qBPsNYrWVsgOUvBCrteVjKGkdVqpPfzn' },
			params: {'datasetid' : 'normal_mly',
					'limit' : 100,
					'startdate'	: start,
					'enddate'	: end,
					'datatypeid': ['mly-tmin-normal','mly-tmax-normal','mly-tavg-normal','mly-prcp-normal'],
					'stationid': 'GHCND:USW00014835'
			}

		})
	       .then(function(res){
	       		console.log(res.data);
	       		deffered.resolve(res.data);            
	    }, function(){
	    	deffered.reject('error');
	    });
	    return deffered.promise;
	};
	/* jshint ignore:end */

    this.getAptData = function(){
    	var deffered = $q.defer();
    	$http.get('data/apt.json')
	       .then(function(res){
	       		deffered.resolve(res.data);            
	    }, function(){
	    	deffered.reject('error');
	    });
	    return deffered.promise;
    };

  });
