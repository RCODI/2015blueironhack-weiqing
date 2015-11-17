'use strict';
/*global $  */
/**
 * @ngdoc directive
 * @name 2015blueironhackWeiqingApp.directive:showtab
 * @description
 * # showtab
 */
angular.module('2015blueironhackWeiqingApp')
  .directive('showtab', function () {
    return {
      link: function(scope, element, attrs) {
       	element.click(function(e) {
            e.preventDefault();
            console.log($(element));
            $(element).tab('show');
        });
      }
    };
  });
