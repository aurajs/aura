// ## Core Extension
// @fileOverview Extend the aura-core (mediator pattern).
define(['aura_core', 'backbone', 'localstorage'], function(core, Backbone, Store) {
  "use strict";

  var auraCore = Object.create(core);
  auraCore.data.Store = Store;
  auraCore.mvc = Backbone;

  return auraCore;

});
