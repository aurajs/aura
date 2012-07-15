//     Aura.js 0.8.1
//     (c) 2011-2012 Addy Osmani, Dustin Boston, The Aura Project.
//     Aura may be freely distributed under the MIT license.

(function () {

  // Reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Aura` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousAura = root.Aura;

   // The top-level namespace. All public Aura classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Aura;
  if (typeof exports !== 'undefined') {
    Aura = exports;
  } else {
    Aura = root.Aura = {};
  }
  // Current version of the library. Keep in sync with `package.json`.
  Aura.VERSION = '0.8.1';

  // For Aura's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).

  Aura.setDomLibrary = function (lib) {
    $ = lib;
  };
  // Runs Aura.js in *noConflict* mode, returning the `Aura` variable
  // to its previous owner. Returns a reference to this Aura object.
  Aura.noConflict = function () {
    root.Aura = previousAura;
    return this;
  };



  // Aura.Core
  // --------------
  // Create a new Mediator
  var Core = function () {

  	var self = this;

	this.channels = {};
	// Loaded modules and their callbacks

	// Uncomment if using zepto
	// Deferred.installInto($);

	// Override the default error handling for requirejs
	//
	// TODO: Replace this with the new errbacks
	//
	// * [Handling Errors](http://requirejs.org/docs/api.html#errors)
	if(requirejs && requirejs !== undefined){
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
	}

	// Subscribe to an event
	//
	// * **param:** {string} channel Event name
	// * **param:** {string} subscriber Subscriber name
	// * **param:** {function} callback Module callback
	// * **param:** {object} context Context in which to execute the module
	this.subscribe = function (channel, subscriber, callback, context) {
		if (channel === undefined || callback === undefined || context === undefined) {
			throw new Error("Channel, callback, and context must be defined");
		}
		if (typeof channel !== "string") {
			throw new Error("Channel must be a string");
		}
		if (typeof subscriber !== "string") {
			throw new Error("Subscriber must be a string");
		}
		if (typeof callback !== "function") {
			throw new Error("Callback must be a function");
		}

		self.channels[channel] = (!self.channels[channel]) ? [] : self.channels[channel];
		self.channels[channel].push({
			subscriber: subscriber,
			callback: this.util.method(callback, context)
		});
	};

	// Publish an event, passing arguments to subscribers. Will
	// call start if the channel is not already registered.
	//
	// * **param:** {string} channel Event name
	this.publish = function (channel) {
		if (channel === undefined) {
			throw new Error("Channel must be defined");
		}
		if (typeof channel !== "string") {
			throw new Error("Channel must be a string");
		}
		var i, l, args = [].slice.call(arguments, 1);
		if (!self.channels[channel]) {
			return;
		}
		for (i = 0, l = self.channels[channel].length; i < l; i += 1) {
			try {
				self.channels[channel][i]['callback'].apply(this, args);
			} catch (e) {
				console.error(e.message);
			}
		}
	};

	// Automatically load a widget and initialize it. File name of the
	// widget will be derived from the channel, decamelized and underscore
	// delimited by default.
	//
	// * **param:** {string} channel Event name
	this.start = function (channel, element) {
		if (channel === undefined) {
			throw new Error("Channel must be defined");
		}
		if (typeof channel !== "string") {
			throw new Error("Channel must be a string");
		}

		var i, l, args = [].slice.call(arguments, 1),
			file = self.util.decamelize(channel);
		// If a widget hasn't called subscribe this will fail because it wont
		// be present in the channels object

		require(["widgets/" + file + "/main"], function (main) {
			try {
				main(element);
			} catch(e) {
				console.error(e);
			}
		});

	};

	// Unload a widget (collection of modules) by passing in a named reference
	// to the channel/widget. This will both locate and reset the internal
	// state of the modules in require.js and empty the widgets DOM element
	//
	// * **param:** {string} channel Event name
	this.stop = function (channel) {
		var args = [].slice.call(arguments, 1),
			el = args[0],
			file = self.util.decamelize(channel);

		for (var ch in self.channels) {
			if (self.channels.hasOwnProperty(ch)) {
				for (var i = 0; i < channels[ch].length; i++) {
					if (self.channels[ch][i].subscriber === channel) {
						self.channels[ch].splice(i);
					}
				}
			}
		}
		// Remove all modules under a widget path (e.g widgets/todos)
		self.unload("widgets/" + file);
		// Empty markup associated with the module
		$(el).html('');
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
	this.unload = function (channel) {
		var contextMap = requirejs.s.contexts._.urlMap;
		for (key in contextMap) {
			if (contextMap.hasOwnProperty(key) && key.indexOf(channel) !== -1) {
				require.undef(key);
			}
		}
	};

	this.util = {
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

	this.dom = {
		find: function (selector, context) {
			context = context || document;
			return $(context).find(selector);
		},
		data: function (selector, attribute) {
			return $(selector).data(attribute);
		}
	};

	this.events = {
		listen: function (context, events, selector, callback) {
			return $(context).on(events, selector, callback);
		},
		bindAll: function () {
			return _.bindAll.apply(this, arguments);
		}
	};

	this.template = {
		parse: _.template
	};

	// Placeholder for things like ajax and local storage
	this.data = {
		deferred: $.Deferred
	};

	this.getChannels = function () {
		return channels;
	};

	return this;

  };


  // Aura.Sandbox
  // --------------
  // Create a new Facade
  var Sandbox = function (Core) {
		

		// * **param:** {string} subscriber Module name
		// * **param:** {string} channel Event name
		// * **param:** {object} callback Module
		this.subscribe = function (channel, subscriber, callback, context) {
			if (Permissions.validate(channel, subscriber)) {
				Core.subscribe(channel, subscriber, callback, context || this);
			}
		};

		// * **param:** {string} channel Event name
		this.publish = function (channel) {
			Core.publish.apply(Core, arguments);
		};

		// * **param:** {string} channel Event name
		this.start = function (channel) {
			Core.start.apply(Core, arguments);
		};

		// * **param:** {string} channel Event name
		this.stop = function (channel) {
			Core.stop.apply(Core, arguments);
		};

		this.dom = {
			// * **param:** {string} selector CSS selector for the element
			// * **param:** {string} context CSS selector for the context in which
			// to search for selector
			// * **returns:** {object} Found elements or empty array
			find: function (selector, context) {
				return Core.dom.find(selector, context);
			}
		};

		this.events = {
			// * **param:** {object} context Element to listen on
			// * **param:** {string} events Events to trigger, e.g. click, focus, etc.
			// * **param:** {string} selector Items to listen for
			// * **param:** {object} data
			// * **param:** {object} callback
			listen: function (context, events, selector, callback) {
				Core.events.listen(context, events, selector, callback);
			},
			bindAll: Core.events.bindAll
		};

		this.util = {
			each: Core.util.each,
			rest: Core.util.rest,
			delay: Core.util.delay,
			extend: Core.util.extend
		};

		this.data = Core.data;

		this.template = Core.template;

		return this;	
  };

  // Aura.Permissions
  // --------------
  // Create a new Permissions structure
  var Permissions = function () {
		var obj = {},
			rules = {};
			
		this.extend = function (extended) {
			if (window.Aura && window.Aura.obj) {
				rules = $.extend(true, {}, extended, window.Aura.obj);
			} else {
				rules = extended;
			}
		};

		// * **param:** {string} subscriber Module name
		// * **param:** {string} channel Event name
		this.validate = function(subscriber, channel){
			var test = rules[channel][subscriber];
			return test === undefined ? false : test;
		};

		return this;

  };


Aura.Core = new Core();
Aura.Sandbox = new Sandbox(Aura.Core);
Aura.Permissions = new Permissions();


}).call(this);


// Expose Aura as an AMD module
if ( typeof define === "function" && define.amd ) {
	define( "aura", [], function () { return Aura; } );
}
