define([], function() {
  'use strict';

  var noop = function() {};

  function Logger() {
    this.log = noop;
    this.warn = noop;
    this.error = noop;
    return this;
  }

  Logger.prototype.enable = function() {
    var console = window.console || {};
    this.log = (console.log || noop).bind(console);
    this.warn = (console.warn || noop).bind(console);
    this.error = (console.error || noop).bind(console);
  };

  return Logger;
});

