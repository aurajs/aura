/* jslint sloppy:true */
/* global define */

// ## Core Extension
// @fileOverview Extend the aura-core mediator
define(['aura_core', 'backbone', 'localstorage'], function (core, Backbone, Store) {

	var mediator = Object.create(core);
	mediator.data.Store = Store;
	mediator.mvc = Backbone;

	return mediator;

});