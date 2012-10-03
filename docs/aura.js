
// ## Core
// Implements the mediator pattern and
// encapsulates the core functionality for this application.
// Based on the work by Addy Osmani and Nicholas Zakas.
//
// * [Patterns For Large-Scale JavaScript Application Architecture](http://addyosmani.com/largescalejavascript/)
// * [Large-scale JavaScript Application Architecture Slides](http://speakerdeck.com/u/addyosmani/p/large-scale-javascript-application-architecture)
// * [Building Large-Scale jQuery Applications](http://addyosmani.com/blog/large-scale-jquery/)
// * [Nicholas Zakas: Scalable JavaScript Application Architecture](http://www.youtube.com/watch?v=vXjVFPosQHw&feature=youtube_gdata_player)
// * [Writing Modular JavaScript: New Premium Tutorial](http://net.tutsplus.com/tutorials/javascript-ajax/writing-modular-javascript-new-premium-tutorial/)

/*jslint nomen:true, sloppy:true, browser:true*/
/*global define, require, _*/
define('aura_core',['jquery', 'underscore'], function ($, _) {

    var channels = {},  // Loaded modules and their callbacks
        obj = {};       // Mediator object


    // Override the default error handling for requirejs
    //
    // TODO: Replace this with the new errbacks
    //
    // * [Handling Errors](http://requirejs.org/docs/api.html#errors)
    requirejs.onError = function (err) {
        if (err.requireType === 'timeout') {
            console.warn('Could not load module ' + err.requireModules);
        } else {

            // If a timeout hasn't occurred and there was another module
            // related error, unload the module then throw an error
            var failedId = err.requireModules && err.requireModules[0];
            requirejs.undef(failedId);

            throw err;
        }
    };



    // Subscribe to an event
    //
    // * **param:** {string} channel Event name
    // * **param:** {object} callback Module callback
    // * **param:** {object} context Context in which to execute the module
    obj.on = function (channel, callback, context) {
        channels[channel] = (!channels[channel]) ? [] : channels[channel];
        channels[channel].push(this.util.method(callback, context));
    };


    // Publish an event, passing arguments to subscribers. Will
    // call start if the channel is not already registered.
    //
    // * **param:** {string} channel Event name
    obj.emit = function (channel) {
        var i, l, args = [].slice.call(arguments, 1);
        if (!channels[channel]) {
            obj.start.apply(this, arguments);
            return;
        }

        for (i = 0, l = channels[channel].length; i < l; i += 1) {
            channels[channel][i].apply(this, args);
        }
    };


    // Automatically load a widget and initialize it. File name of the
    // widget will be derived from the channel, decamelized and underscore
    // delimited by default.
    //
    // * **param:** {string} channel Event name
    obj.start = function (channel){

        var i, l,
            args = [].slice.call(arguments, 1),
            file = obj.util.decamelize(channel);

        // If a widget hasn't called subscribe this will fail because it wont
        // be present in the channels object
        require(["widgets/" + file + "/main"], function () {
            for (i = 0, l = channels[channel].length; i < l; i += 1) {
                channels[channel][i].apply(obj, args);
            }
        });
    };



   // Unload a widget (collection of modules) by passing in a named reference
   // to the channel/widget. This will both locate and reset the internal
   // state of the modules in require.js and empty the widgets DOM element
   //
   // * **param:** {string} channel Event name
    obj.stop = function(channel){

        var args = [].slice.call(arguments, 1),
            el = args[0],
            file = obj.util.decamelize(channel);

        // Remove all modules under a widget path (e.g widgets/todos)
        obj.unload("widgets/" + file);

        // Empty markup associated with the module

        if(el) {
            $(el).html('');
        }
    };


   // Undefine/unload a module, resetting the internal state of it in require.js
   // to act like it wasn't loaded. By default require won't cleanup any markup
   // associated with this
   //
   // The interesting challenge with .stop() is that in order to correctly clean-up
   // one would need to maintain a custom track of dependencies loaded for each
   // possible channel, including that channels DOM elements per depdendency.
   //
   // This issue with this is shared dependencies. E.g, say one loaded up a module
   // containing jQuery, others also use jQuery and then the module was unloaded.
   // This would cause jQuery to also be unloaded if the entire tree was being done
   // so.
   //
   // A simpler solution is to just remove those modules that fall under the
   // widget path as we know those dependencies (e.g models, views etc) should only
   // belong to one part of the codebase and shouldn't be depended on by others.
   //
   // * **param:** {string} channel Event name
    obj.unload = function(channel){
        var contextMap = requirejs.s.contexts._.urlMap;
        for (key in contextMap) {
            if (contextMap.hasOwnProperty(key) && key.indexOf(channel) !== -1) {
                require.undef(key);
            }
        }

    };


    obj.util = {
        each: _.each,
        extend: _.extend,
        decamelize: function (camelCase, delimiter) {
            delimiter = (delimiter === undefined) ? "_" : delimiter;
            return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
        },

        // Camelize a string
        //
        // * [https://gist.github.com/827679](camelize.js)
        //
        // * **param:** {string} str String to make camelCase
        camelize: function (str) {
            return str.replace(/(?:^|[\-_])(\w)/g, function (delimiter, c) {
                return c ? c.toUpperCase() : '';
            });
        },

        // Always returns the fn within the context
        //
        // * **param:** {object} fn Method to call
        // * **param:** {object} context Context in which to call method
        // * **returns:** {object} Fn with the correct context
        method: function (fn, context) {
            return $.proxy(fn, context);
        },
        parseJson: function (json) {
            return $.parseJSON(json);
        },

        // Get the rest of the elements from an index in an array
        //
        // * **param:** {array} arr The array or arguments object
        // * **param:** {integer} [index=0] The index at which to start
        rest: function (arr, index) {
            return _.rest(arr, index);
        },
        delay: function () {
            return _.delay.apply(this, arguments);
        }
    };

    obj.dom = {
        find: function (selector, context) {
            context = context || document;
            return $(context).find(selector);
        },
        data: function (selector, attribute) {
            return $(selector).data(attribute);
        }
    };

    obj.events = {
        listen: function (context, events, selector, callback) {
            return $(context).on(events, selector, callback);
        },
        bindAll: function () {
            return _.bindAll.apply(this, arguments);
        }
    };

    obj.template = {
        parse: _.template
    };

    // Placeholder for things like ajax and local storage
    obj.data = {
        deferred: $.Deferred
    };

    obj._getChannels = function() {
        return channels;
    };

    return obj;

});

// ## Permissions
// A permissions structure can support checking
// against subscriptions prior to allowing them
// to clear. This enforces a flexible security
// layer for your application.
//
//     {eventName: {moduleName:[true|false]}, ...}
define('aura_perms',["jquery"], function ($) {

	var permissions = {},
        rules = {};

    permissions.extend = function (extended) {
        if (window.aura && window.aura.permissions) {
            rules = $.extend(true, {}, extended, window.aura.permissions);
        } else {
            rules = extended;
        }

    };

  // * **param:** {string} subscriber Module name
  // * **param:** {string} channel Event name
	permissions.validate = function(subscriber, channel){
		var test = rules[channel][subscriber];
		return test === undefined ? false : test;
	};

	return permissions;
});

// ## Sandbox
// Set up an standard interface for modules. This is a
// subset of the mediator functionality.
//
// Note: Handling permissions/security is optional here
// The permissions check can be removed
// to just use the mediator directly.

/*global define*/
define('facade',["aura_core", "aura_perms"], function (mediator, permissions) {

    var facade = {};



    // * **param:** {string} subscriber Module name
    // * **param:** {string} channel Event name
    // * **param:** {object} callback Module
    facade.on = function (subscriber, channel, callback) {
        if (permissions.validate(subscriber, channel)) {
            mediator.on(channel, callback, this);
        }
    };


    // * **param:** {string} channel Event name
    facade.emit = function (channel) {
        mediator.emit.apply(mediator, arguments);
    };



    // * **param:** {string} channel Event name
    facade.start = function(channel){
        mediator.start.apply(mediator, arguments);
    };


    // * **param:** {string} channel Event name
    facade.stop = function(channel){
        mediator.stop.apply(mediator, arguments);
    };



    facade.dom = {

        // * **param:** {string} selector CSS selector for the element
        // * **param:** {string} context CSS selector for the context in which
        // to search for selector
        // * **returns:** {object} Found elements or empty array
        find: function (selector, context) {
            return mediator.dom.find(selector, context);
        }
    };

    facade.events = {

        // * **param:** {object} context Element to listen on
        // * **param:** {string} events Events to trigger, e.g. click, focus, etc.
        // * **param:** {string} selector Items to listen for
        // * **param:** {object} data
        // * **param:** {object} callback
        listen: function (context, events, selector, callback) {
            mediator.events.listen(context, events, selector, callback);
        },
        bindAll: mediator.events.bindAll
    };

    facade.util = {
        each: mediator.util.each,
        rest: mediator.util.rest,
        delay: mediator.util.delay,
        extend: mediator.util.extend
    };

    facade.data = mediator.data;
    facade.template = mediator.template;

    return facade;
});
