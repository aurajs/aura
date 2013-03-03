define([], function() {
  'use strict';

  var noop = function() {};

  function Logger() {
    this.sender = 'Aura';
    this._log = noop;
    this._warn = noop;
    this._error = noop;
    return this;
  }

  Logger.prototype.setName = function(name){
    this.sender = name;
  }

  Logger.prototype.enable = function() {
    var console = window.console || {};
    this._log = (console.log || noop).bind(console);
    this._warn = (console.warn || noop).bind(console);
    this._error = (console.error || noop).bind(console);
  };

  Logger.prototype.log = function() {
    this._log(this.sender, arguments);
  };

  Logger.prototype.warn = function() {
    this._warn(this.sender, arguments);
  };

  Logger.prototype.error = function() {
    this._error(this.sender, arguments);
  };

  return Logger;
});

