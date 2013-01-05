// ## Sandbox Extension
// @fileOverview Extend the aura-sandbox (facade pattern)
// @todo This is a stupid place to include jquery ui
define(['backbone', 'localstorage', 'jquery_ui'], function(Backbone, Store) {
  'use strict';

  return {
    extend: function(sandbox, channel) {
      sandbox.data.Store = Store;
      sandbox.mvc = {};
      sandbox.widgets = {};

      sandbox.mvc.View = function(view) {
        return Backbone.View.extend(view);
      };

      sandbox.mvc.Model = function(model) {
        return Backbone.Model.extend(model);
      };

      sandbox.mvc.Collection = function(collection) {
        return Backbone.Collection.extend(collection);
      };

      sandbox.mvc.Router = function(router) {
        return Backbone.Router.extend(router);
      };

      sandbox.widgets.stop = function(channel, el) {
        return sandbox.stop.apply(this, arguments);
      };

      sandbox.widgets.start = function(channel, options) {
        return sandbox.start.apply(this, arguments);
      };

      return sandbox;
    }
  };
});
