/* jslint sloppy:true */
/* global define */

// ## Core Extension
// @fileOverview Extend the aura-core mediator
define(["aura", "backbone", "localstorage"], function (Aura, Backbone, Store) {

	var mediator = Aura.Core;
	mediator.data.Store = Store;
	mediator.mvc = Backbone;

	return mediator;

});