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

      var defaultConfig = {
        wildcard: true,
        delimiter: '.',
        newListener: true,
        maxListeners: 20
      };
      app.config.mediator = _.extend(defaultConfig, app.config.mediator);
      var mediator = new EventEmitter(app.config.mediator);

      app.core.mediator = mediator;

      app.sandbox.on = function (name, listener) {
        this._events = this._events || [];
        this._events.push({ name: name, listener: listener});

        mediator.on(name, listener);
      };

      app.sandbox.off = function (name, listener) {
        if(!this._events) { return; }
        this._events = _.reject(this._events, function (e) {
          return (e.name === name && e.listener === listener);
        });

        mediator.off(name, listener);
      };

      app.sandbox.emit = function () {
        mediator.emit.apply(mediator, arguments);
      };

      app.sandbox.stopListening = function () {
        if(!this._events) { return; }

        _.each(this._events, function (e) {
          mediator.off(e.name, e.listener);
        });
      };

      var event = ['aura', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
      app.core.mediator.on(event, function (s) {
        s.stopListening();
      });
    }
  };
});
