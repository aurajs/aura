define([], function() {
  'use strict';

  var noop    = function() {},
      console = window.console || {};

  function Logger(name) {
    this.name   = name;
    this._log   = noop;
    this._warn  = noop;
    this._error = noop;
    this._enabled = false;
    return this;
  }

  Logger.prototype.isEnabled = function () {
    return this._enabled;
  };

  Logger.prototype.setName = function(name){
    this.name = name;
  };

  Logger.prototype.enable = function() {
    if (Function.prototype.bind && typeof console === "object") {
      var logFns = ["log", "warn", "error"];
      for (var i = 0; i < logFns.length; i++) {
        console[logFns[i]] = Function.prototype.call.bind(console[logFns[i]], console);
      }
    }

    this._log     = (console.log   || noop);
    this._warn    = (console.warn  || this._log);
    this._error   = (console.error || this._log);
    this._enabled = true;

    return this;
  };

  Logger.prototype.write = function(output, args){
    var parameters = Array.prototype.slice.call(args);
    parameters.unshift(this.name + ":");
    output.apply(console, parameters);
  };

  Logger.prototype.log = function() {
    this.write(this._log, arguments);
  };

  Logger.prototype.warn = function() {
    this.write(this._warn, arguments);
  };

  Logger.prototype.error = function() {
    this.write(this._error, arguments);
  };

  return Logger;
});
