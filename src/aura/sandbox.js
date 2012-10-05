// ## Sandbox
// Implements the sandbox pattern and set up an standard interface for modules.
// This is a subset of the mediator functionality.
//
// Note: Handling permissions/security is optional here
// The permissions check can be removed
// to just use the mediator directly.
define(['aura_core', 'aura_perms'], function(mediator, permissions) {
  'use strict';

  var sandbox = {};

  // * **param:** {string} subscriber Module name
  // * **param:** {string} channel Event name
  // * **param:** {object} callback Module
  sandbox.on = function(channel, subscriber, callback, context) {
    if (permissions.validate(channel, subscriber)) {
      mediator.on(channel, subscriber, callback, context || this);
    }
  };

  // * **param:** {string} channel Event name
  sandbox.emit = function(channel) {
    mediator.emit.apply(mediator, arguments);
  };

  // * **param:** {Object/Array} an array with objects or single object containing channel and element
  sandbox.start = function(list) {
    mediator.start.apply(mediator, arguments);
  };

  // * **param:** {string} channel Event name
  // * **param:** {string} el Element name
  sandbox.stop = function(channel, el) {
    mediator.stop.apply(mediator, arguments);
  };

  sandbox.dom = {
    // * **param:** {string} selector CSS selector for the element
    // * **param:** {string} context CSS selector for the context in which
    // to search for selector
    // * **returns:** {object} Found elements or empty array
    find: function(selector, context) {
      return mediator.dom.find(selector, context);
    }
  };

  sandbox.events = {
    // * **param:** {object} context Element to listen on
    // * **param:** {string} events Events to trigger, e.g. click, focus, etc.
    // * **param:** {string} selector Items to listen for
    // * **param:** {object} data
    // * **param:** {object} callback
    listen: function(context, events, selector, callback) {
      mediator.events.listen(context, events, selector, callback);
    },
    bindAll: mediator.events.bindAll
  };

  sandbox.util = {
    each: mediator.util.each,
    extend: mediator.util.extend
  };

  sandbox.data = mediator.data;

  sandbox.template = mediator.template;

  return sandbox;

});
