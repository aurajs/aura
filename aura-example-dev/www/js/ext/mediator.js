/**
 * @fileOverview Extend the aura-core mediator
 */
/*jslint sloppy:true*/
/*global define*/
define(["aura_core", "backbone", "localstorage"],
    function (core, Backbone, Store) {

        var mediator = Object.create(core);

        // var initialized = {
        //     collections: {},
        //     models: {}
        // };

        // mediator.mvc = {
        //     createView: function (view) {
        //         return Backbone.View.extend(view);
        //     },
        //     createCollection: function (collection) {
        //         return Backbone.Collection.extend(collection);
        //     },
        //     createModel: function (model) {
        //         return Backbone.Model.extend(model);
        //     },
        //     getCollection: function (collection) {
        //         var dfr;
        //         if (initialized.collections[collection] !== undefined) {
        //             return initialized.collections[collection];
        //         } else {
        //             dfr = mediator.data.deferred();
        //             // @todo error handling
        //             require(["collections/" + collection], function (Module) {
        //                 initialized.collections[collection] = new Module();
        //                 dfr.resolve(initialized.collections[collection]);
        //             });

        //             return dfr.promise();
        //         }
        //     },
        //     getModel: function (model) {
        //         var dfr;
        //         if (initialized.models[model] !== undefined) {
        //             return initialized.models[model];
        //         } else {
        //             dfr = mediator.data.deferred();
        //             // @todo error handling
        //             require(["models/" + model], function (Module) {
        //                 initialized.models[model] = new Module();
        //                 dfr.resolve(initialized.models[model]);
        //             });

        //             return dfr.promise();
        //         }
        //     }
        // };

        mediator.data.Store = Store;
        mediator.mvc = {};
        mediator.mvc.View = Backbone.View.extend;
        mediator.mvc.Model = Backbone.Model.extend;
        mediator.mvc.Collection = Backbone.Collection.extend;

        return mediator;
     });
