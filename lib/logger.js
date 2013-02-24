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
    this.log = function(){(console.log || noop).call(console, arguments);};
    this.warn = function(){(console.warn || noop).call(console, arguments);};
    this.error = function(){(console.error || noop).call(console, arguments);};
  };

  return Logger;
});

