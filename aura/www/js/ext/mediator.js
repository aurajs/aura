/**
 * @fileOverview Extend the aura-core mediator
 */
/*jslint sloppy:true*/
/*global define*/
define(["aura_core", "backbone", "localstorage"],
    function (core, Backbone, Store) {
        var mediator = Object.create(core);
        mediator.data.Store = Store;
        mediator.mvc = Backbone;
        return mediator;
     });
