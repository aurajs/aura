define('aura/ext/mediator', function() {

  'use strict';

  return {
    name: 'mediator',

    require: { paths: { eventemitter: 'components/eventemitter2/lib/eventemitter2' } },

    initialize: function(app) {
      var EventEmitter    = require('eventemitter');
      var mediatorConfig  = app.config.mediator || { wildcard: true, delimiter: ".", maxListeners: 20, newListener: true };
      var mediator        = new EventEmitter(mediatorConfig);
      app.core.mediator   = mediator;
      
      app.sandbox.on      = function(event, listener) {
        this._listeners = this._listeners || [];
        this._listeners.push({ event: event, listener: listener });
        mediator.on(event, listener);
      };
      
      app.sandbox.off     = function(event, listener) {
        var listeners = this._listeners = this._listeners || [];
        this._listeners = _.select(listeners, function(l) {
          if (l.event === event && l.listener === listener) {
            return false;
          } else {
            return true;
          }
        });
        mediator.off(event, listener);
      };
      
      app.sandbox.emit    = function() { 
        mediator.emit.apply(mediator, arguments); 
      };

      app.sandbox.stopListening = function() {
        _.map(this._listeners, function(l) {
          mediator.off(l.event, l.listener);
        });
      };
      
      mediator.on(['aura', 'sandbox', 'stop'].join(mediatorConfig.delimiter), function(sb) {
        sb.stopListening();
      });
    }
  };
});
