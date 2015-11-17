'use strict';

/**
 * @ngdoc service
 * @name 2015blueironhackWeiqingApp.d3Service
 * @description
 * # d3Service
 * Factory in the 2015blueironhackWeiqingApp.
 */
angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {
    var d = $q.defer();

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

    function onScriptLoad() {
      // Load client in the browser
      var d3TipLib = 'http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js';
        loadScript(d3TipLib, function(){
          $rootScope.$apply(function() { d.resolve(window.d3); });
        });
      
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'bower_components/d3/d3.js';
    scriptTag.onreadystatechange = function () {
    if (this.readyState === 'complete') { onScriptLoad(); }
  };
  scriptTag.onload = onScriptLoad;

  var s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    d3: function() { return d.promise; }
  };
}]);
