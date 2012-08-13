/*jshint nomen:true, sloppy:true, browser:true*/
/*global define, require, console*/

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
// include 'deferred' if using zepto
define(['base'], function (base) {

	var channels = {}, // Loaded modules and their callbacks
		obj = {}, // Mediator object
		_publishQueue = [],
		isWidgetLoading = false,
        WIDGETS_PATH = '../../../widgets'; // Path to widgets


    // Load in the base library, such as Zepto or jQuery. the following are
    // required for Aura to run:
    //
    // * base.data.deferred
    // * base.data.when
    // * base.data.dom.find
    (function () {
        if (typeof base === undefined) {
            throw new Error('Base library is required');
        }

		if (!(base.data != null)) {
			throw new Error('Base library must include the data property');
		}

		if (!(base.data.deferred != null)) {
			throw new Error('Base library must include data.deferred');
		}

		if (!(base.data.when != null)) {
			throw new Error('Base library must include data.when');
		}

		if (!(base.dom != null)) {
			throw new Error('Base library must include the dom property');
		}

		if (!(base.dom.find != null)) {
			throw new Error('Base library must include dom.find');
		}

		obj = base;

    })();


    // The bind method is used for callbacks.
    //
    // * (bind)[https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind]
    // * (You don't need to use $.proxy)[http://www.aaron-powell.com/javascript/you-dont-need-jquery-proxy]
    if (!Function.prototype.bind) {
      Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
          // closest thing possible to the ECMAScript 5 internal IsCallable function
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
               aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
      };
    }

	// Returns true if an object is an array, false if it is not.
	//
	// * (isArray)[https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray]
	if(!Array.isArray) {
		Array.isArray = function (vArg) {
		  return Object.prototype.toString.call(vArg) === "[object Array]";
		};
	}

	// Uncomment if using zepto
	// Deferred.installInto($);

	// Override the default error handling for requirejs
	//
	// TODO: Replace this with the new errbacks
	//
	// * [Handling Errors](http://requirejs.org/docs/api.html#errors)
    /*
	require.onError = function (err) {
		if (err.requireType === 'timeout') {
			console.warn('Could not load module ' + err.requireModules);
		} else {
			// If a timeout hasn't occurred and there was another module
			// related error, unload the module then throw an error
			var failedId = err.requireModules && err.requireModules[0];
			require.undef(failedId);
			throw err;
		}
	};
    */

	function decamelize (camelCase, delimiter) {
		delimiter = (delimiter === undefined) ? '_' : delimiter;
		return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
	}

	// Is a given variable an object? (via Underscore)
	function isObject(obj) {
		return obj === Object(obj);
	};

    obj.getWidgetsPath = function () {
        return WIDGETS_PATH;
    };

    // Subscribe to an event
	//
	// * **param:** {string} channel Event name
	// * **param:** {string} subscriber Subscriber name
	// * **param:** {function} callback Module callback
	// * **param:** {object} context Context in which to execute the module
	obj.subscribe = function (channel, subscriber, callback, context) {
		if (channel === undefined || callback === undefined || context === undefined) {
			throw new Error('Channel, callback, and context must be defined');
		}
		if (typeof channel !== 'string') {
			throw new Error('Channel must be a string');
		}
		if (typeof subscriber !== 'string') {
			throw new Error('Subscriber must be a string');
		}
		if (typeof callback !== 'function') {
			throw new Error('Callback must be a function');
		}

		channels[channel] = (!channels[channel]) ? [] : channels[channel];
		channels[channel].push({
			subscriber: subscriber,
            callback: callback.bind(context)
			//callback: this.util.method(callback, context)
		});
	};

    obj.getPublishQueueLength = function () {
        return _publishQueue.length;
    };

	// Publish an event, passing arguments to subscribers. Will
	// call start if the channel is not already registered.
	//
	// * **param:** {string} channel Event name
	obj.publish = function (channel) {
		if (channel === undefined) {
			throw new Error('Channel must be defined');
		}
		if (typeof channel !== 'string') {
			throw new Error('Channel must be a string');
		}
		if (isWidgetLoading) { //Catch publish event!
			_publishQueue.push( arguments );
			return false;
		}

		var i, l, args = [].slice.call(arguments, 1);
		if (!channels[channel]) {
			return false;
		}
		for (i = 0, l = channels[channel].length; i < l; i += 1) {
			try {
				channels[channel][i]['callback'].apply(this, args);
			} catch (e) {
				console.error(e.message);
			}
		}

        return true;
	};

	// Empty the list with all stored publish events.
	obj.emptyPublishQueue = function () {
		var args, i, len;
		isWidgetLoading = false;

		for (i = 0, len = _publishQueue.length; i < len; i++) {
		  obj.publish.apply(this, _publishQueue[i]);
		}

		// _.each(_publishQueue, function(args) {
		// 	obj.publish.apply(this, args);
		// });

		_publishQueue = [];
	};

	// Automatically load a widget and initialize it. File name of the
	// widget will be derived from the channel, decamelized and underscore
	// delimited by default.
	//
	// * **param:** {Object/Array} an array with objects or single object containing channel and element
	obj.start = function (list) {

		// if ( _.isObject(list) && !_.isArray(list) ) {

		//Allow a single object as param
		if (isObject(list) && !Array.isArray(list)) {
			list = [list];
		}

		if ( !Array.isArray(list) ) {
			throw new Error('Channel must be defined as an array');
		}

		var i = 0,
			l = list.length,
			promises = [];

		function load (file, element) {
			var dfd = obj.data.deferred(),
                widgetsPath = obj.getWidgetsPath(),
                requireConfig = require.s.contexts._.config;

            if (requireConfig.paths && hasOwnProperty.call(requireConfig.paths, 'widgets')) {
                widgetsPath = requireConfig.paths.widgets;
            }

            /*
			require([widgetsPath + '/' + file + '/main'], function (main) {
				try {
					main(element);
				} catch(e) {
					console.error(e);
				}
				//Resolve
				dfd.resolve();

			});
            */
            require([widgetsPath + '/' + file + '/main'], function (main) {
                try {
                    main(element);
                } catch(e) {
                    console.error(e);
                }
                dfd.resolve();
             }, function(err) {
                if (err.requireType === 'timeout') {
                    console.warn('Could not load module ' + err.requireModules);
                } else {
                    // If a timeout hasn't occurred and there was another module
                    // related error, unload the module then throw an error
                    var failedId = err.requireModules && err.requireModules[0];
                    require.undef(failedId);
                    throw err;
                }
                dfd.reject();
            });

			return dfd.promise();
		}

		isWidgetLoading = true;

		for (;i<l;i++) {
			var widget = list[i],
				file = decamelize(widget.channel);
			promises.push( load(file, widget.element) );
		}

		// $.when.apply($, promises).done(obj.emptyPublishQueue);
		obj.data.when.apply($, promises).done(obj.emptyPublishQueue);
	};

	// Unload a widget (collection of modules) by passing in a named reference
	// to the channel/widget. This will both locate and reset the internal
	// state of the modules in require.js and empty the widgets DOM element
	//
	// * **param:** {string} channel Event name
	obj.stop = function (channel) {
		var args = [].slice.call(arguments, 1),
			el = args[0],
			file = decamelize(channel);

		for (var ch in channels) {
			if (channels.hasOwnProperty(ch)) {
				for (var i = 0; i < channels[ch].length; i++) {
					if (channels[ch][i].subscriber === channel) {
						channels[ch].splice(i);
					}
				}
			}
		}
		// Remove all modules under a widget path (e.g widgets/todos)
		obj.unload('widgets/' + file);

		// Remove widget descendents, unbinding any event handlers
		// attached to children within the widget.
		obj.dom.find(el).children().remove();
	};

	// Undefine/unload a module, resetting the internal state of it in require.js
	// to act like it wasn't loaded. By default require won't cleanup any markup
	// associated with this
	//
	// The interesting challenge with .stop() is that in order to correctly clean-up
	// one would need to maintain a custom track of dependencies loaded for each
	// possible channel, including that channels DOM elements per dependency.
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
	obj.unload = function (channel) {
		var contextMap = require.s.contexts._.defined,
			key;
		for (key in contextMap) {
			if (contextMap.hasOwnProperty(key) && key.indexOf(channel) !== -1) {
				require.undef(key);
			}
		}
	};


	obj.getChannels = function () {
		return channels;
	};

	return obj;

});
