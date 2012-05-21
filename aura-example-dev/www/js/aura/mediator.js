/**
 * Application core. Implements the mediator pattern and
 * encapsulates the core functionality for this application.
 * Based on the work by Addy Osmani and Nicholas Zakas.
 *
 * @link <a href="http://addyosmani.com/largescalejavascript/">Patterns For Large-Scale JavaScript Application Architecture</a>
 * @link <a href="http://speakerdeck.com/u/addyosmani/p/large-scale-javascript-application-architecture">Large-scale JavaScript Application Architecture Slides</a>
 * @link <a href="http://addyosmani.com/blog/large-scale-jquery/">Building Large-Scale jQuery Applications</a>
 * @link <a href="http://www.youtube.com/watch?v=vXjVFPosQHw&feature=youtube_gdata_player">Nicholas Zakas: Scalable JavaScript Application Architecture</a>
 * @link <a href="http://net.tutsplus.com/tutorials/javascript-ajax/writing-modular-javascript-new-premium-tutorial/">Writing Modular JavaScript: New Premium Tutorial</a>
 */
/*jslint nomen:true, sloppy:true, browser:true*/
/*global define, require, _*/
define(['jquery', 'underscore'], function ($, _) {

    var channels = {},  // Loaded modules and their callbacks
        obj = {};       // Mediator object

    /**
     * Override the default error handling for requirejs
     * @todo When error messages become part of core, use them instead
     * @link <a href="http://requirejs.org/docs/api.html#errors">Handling Errors</a>
     */
    requirejs.onError = function (err) {
        if (err.requireType === 'timeout') {
            console.warn('Could not load module ' + err.requireModules);
        } else {
            throw err;
        }
    };

    /**
     * Subscribe to an event
     * @param {string} channel Event name
     * @param {object} subscription Module callback
     * @param {object} context Context in which to execute the module
     */
    obj.subscribe = function (channel, callback, context) {
        // console.log("obj.subscribe", channel, subscription);
        channels[channel] = (!channels[channel]) ? [] : channels[channel];
        channels[channel].push(this.util.method(callback, context));
    };

    /**
     * Publish an event, passing arguments to subscribers. Will
     * call autoload if the channel is not already registered.
     * @param {string} channel Event name
     */
    obj.publish = function (channel) {
        // console.log("obj.publish", channel);
        var i, l, args = [].slice.call(arguments, 1);
        if (!channels[channel]) {
            obj.autoload.apply(this, arguments);
            return;
        }

        for (i = 0, l = channels[channel].length; i < l; i += 1) {
            channels[channel][i].apply(this, args);
        }
    };

    /**
     * Automatically load a module and initialize it. File name of the
     * module will be derived from the channel, decamelized and underscore
     * delimited by default.
     * @param {string} channel Event name
     */
    obj.autoload = function (channel) {
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

    obj.util = {
        each: _.each,
        extend: _.extend,
        decamelize: function (camelCase, delimiter) {
            delimiter = (delimiter === undefined) ? "_" : delimiter;
            return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
        },
        /**
         * @link <a href="https://gist.github.com/827679">camelize.js</a>
         * @param {string} str String to make camelCase
         */
        camelize: function (str) {
            return str.replace(/(?:^|[\-_])(\w)/g, function (delimiter, c) {
                return c ? c.toUpperCase() : '';
            });
        },
        /**
         * Always returns the fn within the context
         * @param {object} fn Method to call
         * @param {object} context Context in which to call method
         * @returns {object} Fn with the correct context
         */
        method: function (fn, context) {
            return $.proxy(fn, context);
        },
        parseJson: function (json) {
            return $.parseJSON(json);
        },
        /**
         * Get the rest of the elements from an index in an array
         * @param {array} arr The array or arguments object
         * @param {integer} [index=0] The index at which to start
         */
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

    return obj;

});
