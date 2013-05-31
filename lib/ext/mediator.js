define('aura/ext/mediator', function () {
  'use strict';

  return {
    name: 'mediator',

    require: {
      paths: {
        eventemitter: 'components/eventemitter2/lib/eventemitter2',
        underscore: 'components/underscore/underscore'
      },
      shim: {
        underscore: {
          exports: '_'
        }
      }
    },

    initialize: function (app) {
      var EventEmitter = require('eventemitter');
      var _ = require('underscore');

      app.config.mediator = _.defaults(app.config.mediator || {}, {
        wildcard: true,
        delimiter: '.',
        newListener: true,
        maxListeners: 20
      });

      var mediator = new EventEmitter(app.config.mediator);

      app.core.mediator = mediator;

      app.sandbox.on = function (name, listener, context) {
        if (!_.isFunction(listener) || !_.isString(name)) {
          throw new Error('Invalid arguments passed to sandbox.on');
        }
        context = context || this;
        var callback = function() {
          var args = Array.prototype.slice.call(arguments);
          try {
            listener.apply(context, args);
          } catch(e) {

          }
        };

        this._events = this._events || [];
        this._events.push({ name: name, listener: listener, callback: callback });

        mediator.on(name, callback);
      };

      app.sandbox.off = function (name, listener) {
        if(!this._events) { return; }
        this._events = _.reject(this._events, function (evt) {
          var ret = (evt.name === name && evt.listener === listener);
          if (ret) { mediator.off(name, evt.callback); }
          return ret;
        });
      };

      app.sandbox.emit = function () {
        var debug = app.config.debug;
        if(debug.enable && (debug.components.length === 0 || debug.components.indexOf("aura:mediator") !== -1)){
          var eventData = Array.prototype.slice.call(arguments);
          eventData.unshift('Event emitted');
          app.logger.log.apply(app.logger, eventData);
        }
        mediator.emit.apply(mediator, arguments);
      };

      app.sandbox.stopListening = function () {
        if (!this._events) { return; }
        _.each(this._events, function (evt) {
          mediator.off(evt.name, evt.callback);
        });
      };

      var eventName = ['aura', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
      app.core.mediator.on(eventName, function (sandbox) {
        sandbox.stopListening();
      });
    }
  };
});
