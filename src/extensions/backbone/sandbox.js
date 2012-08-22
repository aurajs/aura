// ## Sandbox Extension
// @fileOverview Extend the aura-sandbox (facade pattern)
// @todo This is a stupid place to include jquery ui
define(['aura_sandbox', 'core', 'perms', 'jquery_ui'], function(sandbox, core, perms) {
  "use strict";

  var auraSandbox = Object.create(sandbox);
  auraSandbox.data.Store = core.data.Store;
  auraSandbox.mvc = {};
  auraSandbox.widgets = {};

  auraSandbox.mvc.View = function(view) {
    return core.mvc.View.extend(view);
  };

  auraSandbox.mvc.Model = function(model) {
    return core.mvc.Model.extend(model);
  };

  auraSandbox.mvc.Collection = function(collection) {
    return core.mvc.Collection.extend(collection);
  };

  auraSandbox.widgets.stop = function(channel, el) {
    return sandbox.stop.apply(this, arguments);
  };

  auraSandbox.widgets.start = function(channel, el) {
    return sandbox.start.apply(this, arguments);
  };

  return auraSandbox;

});
