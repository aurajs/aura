/*globals Backbone*/
define(['sandbox', 'underscore'], function(sandbox, _) {
  "use strict";

  return function(element) {
    var Router = sandbox.mvc.Router({
      initialize: function() {
        Backbone.history.start();

        sandbox.emit('initialized', 'Initialized Router');
      },
      routes: {
        '*router': 'router'
      },

      router: function(args) {
        var slice = Array.prototype.slice;
        var event, route;
        args = args.split('/');   // split by slashes
        event = slice.call(args,0);
        event.unshift('route');   // prepend 'route' namespace
        route = event.join('.');  // join into delimeter format
        route = [route];          // wrap route in an array

        // ['route.example', arg1, arg2, arg3]
        sandbox.emit.apply(this, route.concat(args));
      }

    });

    var router = new Router();

    sandbox.on.log('route.**'); // dump all routes to console.log
  };

});
