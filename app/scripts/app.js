'use strict';

/**
 * @ngdoc overview
 * @name 2015blueironhackWeiqingApp
 * @description
 * # 2015blueironhackWeiqingApp
 *
 * Main module of the application.
 */
angular
  .module('2015blueironhackWeiqingApp', [
    'ngRoute','d3','angularSpinner','rzModule','ngDropdowns','720kb.tooltips','chart.js'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/mashup.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/mashup', {
        templateUrl: 'views/mashup.html',
        controller: 'MashupCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
