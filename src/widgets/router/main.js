/*globals Backbone*/
define(['sandbox', 'underscore'], function(sandbox, _) {
  "use strict";

  return function(element) {
    var Router = sandbox.mvc.Router({
      initialize: function() {
        Backbone.history.start();
      },
      routes: {
        '*router': 'router'
      },

      router: function(args) {
        var slice = Array.prototype.slice;
        args = args.split('/');

        sandbox.emit.apply(this, Array.prototype.slice.call(args));
      }

    });

    var router = new Router();

    sandbox.emit('bootstrap', 'router');
    sandbox.on('bootstrap', function(from) {
      sandbox.log('Router-bootstrap message from: ' + from);
    });

    sandbox.on('router', function() {
      sandbox.log('Route in router widget: ', Array.prototype.slice.call(arguments));
    });
  };

});
