define('aura/ext/components', function() {

  'use strict';

  return function(app) {

    var ownProp = function(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };

    var core = app.core;
    var _ = app.core.util._;
    core.Components = core.Components || {};

    /**
     * Components registry
     * @type {Object}
     */
    var registeredComponents = {};

    /**
     * Components Callbacks
     */
    var componentsCallbacks = {};

    function invokeCallbacks(stage, fnName, context, args) {
      var callbacks = componentsCallbacks[stage + ":" + fnName] || [];
      var dfds      = [];
      app.core.util.each(callbacks, function(i, cb) {
        if (typeof cb === 'function') {
          dfds.push(cb.apply(context, args));
        }
      });
      var ret = app.core.data.when.apply(undefined, dfds).promise();
      return ret;
    }

    function invokeWithCallbacks(fn, context) {
      var fnName;
      if (typeof fn === 'string') {
        fnName  = fn;
        fn      = context[fnName] || function() {};
      } else if (typeof fn.name === 'string') {
        fnName = fn.name;
        fn     = fn.fn || function() {};
      } else {
        throw new Error("Error invoking Component with callbacks: ", context.options.name, ". first argument should be either the name of a function or of the form : { name: 'fnName', fn: function() { ... } } ");
      }

      var dfd = app.core.data.deferred();
      var before, after, args = [].slice.call(arguments, 2);
      before = invokeCallbacks("before", fnName, context, args);
      var result;

      before.then(function() {
        var result =  fn.apply(context, args);
        return result;
      }).then(function() {
        invokeCallbacks("after", fnName, context, args).then(function() {
          dfd.resolve(result);
        }, dfd.reject);
      }).fail(function(err) {
        app.logger.error("Error in Component " + context.options.name + " " + fnName + " callback", err);
        dfd.reject(err);
      });

      return dfd.promise();
    }

    /**
     * The base Component constructor...
     * @class  Component
     * @constructor
     * @param {Object} options the options to init the component...
     */
    function Component(options) {
      var opts = _.clone(options);

      /**
       * The Components' options Object, passed to its constructor.
       * TODO: Add explanation of how options are set from HTML API + which default options are
       * set during the Component initialization.
       *
       * @property {Object} options
       */
      this.options    = _.defaults(opts || {}, this.options || {});

      /**
       * Internal, unique reference for a Component instance
       *
       * @property {String} _ref
       */
      this._ref       = opts._ref;

      /**
       * A cached jQuery object for the Components's element.
       *
       * @property {Object} $el
       */
      this.$el        = core.dom.find(opts.el);

      invokeWithCallbacks('initialize', this, this.options);
      return this;
    }

    /**
     * Method called on Components' initialization.
     *
     * @method initialize
     * @param {Object} options options Object passed on Component initialization
     */
    Component.prototype.initialize = function() {};

    /**
     * A helper function to render markup and recursilvely start nested components.
     *
     * @method  html
     * @param  {String} markup the markup to render in the component's root el
     * @return {Component} the Component instance to allow methods chaining...
     */
    Component.prototype.html = function(markup) {
      var el = this.$el;
      el.html(markup);
      var self = this;
      _.defer(function() {
        self.sandbox.start(el, { reset: true });
      });
      return this;
    };

    /**
     * A helper function to find matching elements within the Component's root element.
     *
     * @method  $find
     * @param  {Selector | jQuery Object | Element} selector CSS selector or jQuery object.
     * @return {jQuery Object}
     */
    Component.prototype.$find = function(selector) {
      return this.$el.find(selector);
    };

    /**
     *
     * @method  invokeWithCallbacks
     * @param  {String} methodName the name of the method to invoke with callbacks
     * @return {Promise} a Promise that will resolve to the return value of the original function invoked.
     */
    Component.prototype.invokeWithCallbacks = function(methodName) {
      invokeWithCallbacks(methodName, this);
    };

    // Stolen from Backbone 0.9.9 !
    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;
      if (protoProps && ownProp(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ parent.apply(this, arguments); };
      }
      core.util.extend(child, parent, staticProps);
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate();
      if (protoProps) { core.util.extend(child.prototype, protoProps); }
      child.__super__ = parent.prototype;
      return child;
    };

    Component.extend = extend;

    /**
     * Component loader.
     * @param  {String} name    The name of the Component to load
     * @param  {Object} options The options to pass to the new component instance.
     * @return {Promise}        A Promise that resolves to the loaded component instance.
     */
    Component.load = function(name, opts) {
      // TODO: Make it more simple / or break it down
      // in several functions...
      // it's too big !

      var dfd = core.data.deferred(),
          ref = opts.ref,
          component,
          ComponentConstructor,
          el  = opts.el;

      opts._ref  = core.util._.uniqueId(ref + '+');

      var options = _.clone(opts);

      app.logger.log("Start loading component:", name);

      dfd.fail(function(err) {
        app.logger.error("Error loading component:", name, err);
      });

      // Apply requirejs map / package configuration before the actual loading.
      require.config(options.require);

      // Here, we require the component's package definition
      require([ref], function(componentDefinition) {

        if (!componentDefinition) {
          return dfd.reject("component " + ref + " Definition is empty !");
        }

        try {

          // Ok, the component has already been loaded once, we should already have it in the registry
          if (registeredComponents[ref]) {
            ComponentConstructor = registeredComponents[ref];
          } else {

            if (componentDefinition.type) {
              // If `type` is defined, we use a constructor provided by an extension ? ex. Backbone.
              ComponentConstructor = core.Components[componentDefinition.type];
            } else {
              // Otherwise, we use the stock Component constructor.
              ComponentConstructor = Component;
            }

            if (!ComponentConstructor) {
              throw new Error("Can't find component of type '" +  componentDefinition.type + "', did you forget to include the extension that provides it ?");
            }

            if (core.util._.isObject(componentDefinition)) {
              ComponentConstructor = registeredComponents[ref] = ComponentConstructor.extend(componentDefinition);
            }
          }

          var sandbox = app.sandboxes.create(opts._ref, { el: el });

          sandbox.logger.setName("Component '" + name + "'(" + sandbox.logger.name + ')');

          // Here we inject the sandbox in the component's prototype...
          var ext = { sandbox: sandbox };

          // If the Component is just defined as a function, we use it as its `initialize` method.
          if (typeof componentDefinition === 'function') {
            ext.initialize = componentDefinition;
          }

          ComponentConstructor = ComponentConstructor.extend(ext);

          var newComponent = new ComponentConstructor(options);

          // Sandbox owns its el and vice-versa
          newComponent.$el.data('__sandbox_ref__', sandbox.ref);

          var initialized = core.data.when(newComponent);

          initialized.then(function(ret) { dfd.resolve(ret); });
          initialized.fail(function(err) { dfd.reject(err); });

          return initialized;
        } catch(err) {
          app.logger.error(err.message);
          dfd.reject(err);
        }
      }, function(err) { dfd.reject(err); });

      return dfd.promise();
    };

    /**
     * Parses the component's options from its element's data attributes.
     *
     * @private
     * @param  {String|DomNode} el    the element
     * @param  {String} namespace     current Component's detected namespace
     * @param  {String} opts          an Object containing the base Component's options to extend.
     * @return {Object} An object that contains the Component's options
     */
    function parseComponentOptions(el, namespace, opts) {

      var options = _.clone(opts || {});
      options.el = el;
      options.require = {};

      var name, data = core.dom.data(el);

      // Here we go through all the data attributes of the element to build the options object
      core.util.each(data, function(k, v) {
        k = k.replace(new RegExp("^" + namespace), "");
        k = k.charAt(0).toLowerCase() + k.slice(1);
        if (k !== "component" && k !== 'widget') {
          options[k] = v;
        } else {
          name = v;
        }
      });

      return buildComponentOptions(name, options);
    }

    /**
     * Parses the component's options from its element's data attributes.
     *
     * @private
     * @param  {String} name      the Component's name
     * @param  {Object} opts      an Object containing the base Component's options to extend.
     * @return {Object}           An object that contains the component's options
     */
    function buildComponentOptions(name, options) {
      var ref              = name.split("@"),
          componentName   = core.util.decamelize(ref[0]),
          componentSource = ref[1] || "default",
          requireContext  = require.s.contexts._,
          componentsPath  = app.config.sources[componentSource] || "./aura_components";

      // Register the component as a requirejs package...
      // TODO: packages are not supported by almond, should we find another way to do this ?
      options.name              = componentName;
      options.ref               = '__component__$' + componentName + "@" + componentSource;
      options.baseUrl           = componentsPath + "/" + componentName;
      options.require           = options.require || {};
      options.require.packages  = options.require.packages || [];
      options.require.packages.push({ name: options.ref, location: componentsPath + "/" + componentName });

      return options;
    }

    /**!
     * Returns a list of components.
     * If the first argument is a String, it is considered as a DomNode reference
     * We then parse its content to find aura-components inside of it.
     *
     * @static
     * @param  {Array|String} components a list of components or a reference to a root dom node
     * @return {Array}        a list of component with their options
     */
    Component.parseList = function(components) {
      var list = [];

      if (Array.isArray(components)) {
        _.map(components, function(w) {
          var options = buildComponentOptions(w.name, w.options);
          list.push({ name: w.name, options: options });
        });
      } else if (components && core.dom.find(components)) {
        var appNamespace = app.config.namespace;

        // Support for legacy data-*-widget
        var selector = ["[data-aura-component]", "[data-aura-widget]"];
        if (appNamespace) {
          selector.push("[data-" + appNamespace + "-component]");
          selector.push("[data-" + appNamespace + "-widget]");
        }
        selector = selector.join(",");
        core.dom.find(selector, components || 'body').each(function() {
          var ns = "aura";
          if (appNamespace && (this.getAttribute('data-' + appNamespace +'-component') || this.getAttribute('data-' + appNamespace +'-widget'))) {
            ns = appNamespace;
          }
          var options = parseComponentOptions(this, ns);
          list.push({ name: options.name, options: options });
        });
      }
      return list;
    };

    /**
     * Actual start method for a list of components.
     *
     * @static
     * @param  {Array|String} components cf. `Component.parseList`
     * @return {Promise} a promise that resolves to a list of started components.
     */
    Component.startAll = function(components) {
      var componentsList = Component.parseList(components);
      var list = [];
      core.util.each(componentsList, function(i, w) {
        var ret = Component.load(w.name, w.options);
        list.push(ret);
      });
      var loadedComponents = core.data.when.apply(undefined, list);
      return loadedComponents.promise();
    };

    return {
      name: 'components',

      require: { paths: { text: 'bower_components/requirejs-text/text' } },

      initialize: function(app) {

        // Components 'classes' registry...
        app.core.Components.Base = Component;

        /**
         * @class Aura
         */


        /**
         * Registers a function that will be executed before the associated
         * Component method is called.
         *
         * Once registered, every time a component method will be called with the
         * `invokeWithCallbacks` method the registered callbacks will execute accordingly.
         *
         * The callback functions can return a promise if required in order to
         * postpone the execution of the called function up to when the all
         * registered callbacks results are resolved.
         *
         * The arguments passed to the callbacks are the same than those which
         * with the component will be called. The scope of the callback is
         * the component instance itself, as per the component method.
         *
         * @method components.before
         * @param  {String}   methodName    eg. 'initialize', 'remove'
         * @param  {Function} fn            actual function to run
         */
        app.components.before = function(methodName, fn) {
          var callbackName = "before:" + methodName;
          registerComponentCallback(callbackName, fn);
        };

        /**
         * Same as components.before, but executed after the method invocation.
         *
         * @method components.after
         * @param  {[type]}   methodName eg. 'initialize', 'remove'
         * @param  {Function} fn         actual function to run
         */
        app.components.after = function(methodName, fn) {
          var callbackName = "after:" + methodName;
          registerComponentCallback(callbackName, fn);
        };

        // Actually registering the callbacks in the registry.
        function registerComponentCallback(callbackName, fn) {
          componentsCallbacks[callbackName] = componentsCallbacks[callbackName] || [];
          componentsCallbacks[callbackName].push(fn);
        }

        /**
         * Register a Component Type (experimental).
         * Components type ca be used to encapsulate many custom components behaviours.
         * They will be then used while declaring your components as follows:
         *
         * ```js
         * define({
         *   type: 'myComponentType',
         *   // component declaration...
         * });
         * ```
         *
         * @method components.addType
         * @param  {String}   type a string that will identify the component type.
         * @param  {Function} def A constructor the this component type
         */
        app.components.addType = function(type, def) {
          if (app.core.Components[type]) {
            throw new Error("Component type " + type + " already defined");
          }
          app.core.Components[type] = Component.extend(def);
        };


        /**
         * @class Sandbox
         */

        /**
         * Start method.
         * This method takes either an Array of Components to start or or DOM Selector to
         * target the element that will be parsed to look for Components to start.
         *
         * @method  start
         * @param  {Array|DOM Selector} list    Array of Components to start or parent node.
         * @param  {Object} options             Available options: `reset` : if true, all current children
         *                                      will be stopped before start.
         */
        app.sandbox.start = function (list, options) {
          var event = ['aura', 'sandbox', 'start'].join(app.config.mediator.delimiter);
          app.core.mediator.emit(event, this);
          var children = this._children || [];
          if (options && options.reset) {
            _.invoke(this._children || [], 'stop');
            children = [];
          }
          var self = this;

          Component.startAll(list).done(function () {
            var components   = Array.prototype.slice.call(arguments);
            _.each(components, function (w) {
              w.sandbox._component = w;
              w.sandbox._parent = self;
              children.push(w.sandbox);
            });
            self._children = children;
          });

          return this;
        };

      },

      /**
       * When all of an application's extensions are finally loaded, the 'extensions' 
       * afterAppStart methods are then called.
       *
       * @method components.afterAppStart
       * @param  {Object}   an Aura application object
       */
      afterAppStart: function(app) {
        if (app.config.components !== false && app.startOptions.components !== false) {
          var el;
          if (Array.isArray(app.startOptions.components)) {
            el = core.dom.find('body');
          } else {
            el = core.dom.find(app.startOptions.components);
          }
          app.core.appSandbox = app.sandboxes.create(app.ref, { el: el });
          app.core.appSandbox.start(app.startOptions.components);
        }
      }
    };
  };
});
