define([], function() {
  'use strict';

  var noop    = function() {},
      console = window.console || {};

  function Logger(name) {
    this.name   = name;
    this._log   = noop;
    this._warn  = noop;
    this._error = noop;
    return this;
  }

  Logger.prototype.setName = function(name){
    this.name = name;
  };

  Logger.prototype.enable = function() {
    this._log   = (console.log   || noop);
    this._warn  = (console.warn  || console.log || noop);
    this._error = (console.error || console.log || noop);
    return this;
  };

  Logger.prototype.log = function() {
    this._log.call(console, this.name, arguments);
  };

  Logger.prototype.warn = function() {
    this._warn.call(console, this.name, arguments);
  };

  Logger.prototype.error = function() {
    this._error.call(console, this.name, arguments);
  };

  return Logger;
});

