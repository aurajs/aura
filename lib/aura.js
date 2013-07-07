define([
  './base',
  './aura.extensions',
  './logger'
  ], function(base, ExtManager, Logger) {

  var _ = base.util._,
      noop     = function() {},
      freeze   = Object.freeze || noop;

  /**
  * Aura constructor and main entry point
  *
  * Every instance of Aura is an Aura application.
  * An Aura application is in charge of loading the various
  * extensions that will apply to it (defined either
  * programmatically or by way of configuration).
  *
  * An Aura application is the glue between all the extensions
  * and components inside its instance.
  *
  * Internally an Aura application wraps 4 important objects:
  *
  * - `config` is the object passed as the first param of the apps constructor
  * - `core`   is a container where the extensions add new features
  * - `sandbox` is an object that will be used as a prototype, to create fresh sandboxes to the components
  * - `extensions` An instance of the ExtensionManager. It contains all the extensions that will be loaded in the app.
  *
  * Extensions are here to provide features that will be used by the components...
  * They are meant to extend the apps' core & sandbox.
  * They also have access to the apps's config.
  *
  * Example of a creation of an Aura Application:
  *
  *     var app = aura({ key: 'value' });
  *     app.use('ext1').use('ext2');
  *     app.components.addSource('supercomponents', 'https://my.extern.al/components/store');
  *     app.start('body');
  *
  * @class Aura
  * @param {Object} [config] Main App config.
  * @method constructor
  */
  function Aura(config) {

    if (!(this instanceof Aura)) {
      return new Aura(config);
    }

    var extManager = new ExtManager(),
        app = this;

    /**
     * The App's ref
     *
     * @property {String} ref
     */
    app.ref = _.uniqueId('aura_');

    /**
     * The App's config object
     *
     * @property {Object} config
     */
    app.config = config = config || {};
    app.config.sources = app.config.sources || { "default" : "./aura_components" };


    /*!
     * App Sanboxes
     */

    var appSandboxes = {};
    var baseSandbox = Object.create(base);

    /**
     * Namespace for sanboxes related methods.
     *
     * @type {Object}
     */
    app.sandboxes = {};

    /**
     * Creates a brand new sandbox, using the App's `sandbox` object as a prototype.
     *
     * @method sandboxes.create
     * @param   {String} [ref]      the Sandbox unique ref
     * @param   {Object} [options]  an object to that directly extends the Sandbox
     * @return  {Sandbox}
     */
    app.sandboxes.create = function (ref, options) {

      // Making shure we have a unique ref
      ref = ref || _.uniqueId('sandbox-');
      if (appSandboxes[ref]) {
        throw new Error("Sandbox with ref " + ref + " already exists.");
      }

      // Create a brand new sandbox based on the baseSandbox
      var sandbox = Object.create(baseSandbox);

      // Give it a ref
      sandbox.ref = ref || _.uniqueId('sandbox-');

      // Attach a Logger
      sandbox.logger = new Logger(sandbox.ref);

      // Register it in the app's sandboxes registry
      appSandboxes[sandbox.ref] = sandbox;

      var debug = config.debug;
      if(debug === true || (debug.enable && (debug.components.length === 0 || debug.components.indexOf(ref) !== -1))){
        sandbox.logger.enable();
      }

      // Extend if we have some options
      _.extend(sandbox, options || {});

      return sandbox;
    };

    /**
     * Get a sandbox by reference.
     *
     * @method sandboxes.get
     * @param  {String} ref  the Sandbox ref to retreive
     * @return {Sandbox}
     */
    app.sandboxes.get = function(ref) {
      return appSandboxes[ref];
    };

    /**
     * Tells the app to load the given extension.
     *
     * Aura extensions are loaded in the app during init.
     * they are responsible for :
     *
     * - resolving & loading external dependencies via requirejs
     * - they have a direct access to the app's internals
     * - they are here to add new features to the app... that are made available through the sandboxes to the components.
     *
     * Extensions can have multiple forms :
     *
     * #### AMD Module name
     *
     * ```js
     * aura().use('extensions/my_super_extension').start('body')
     * ```
     *
     * #### Function
     *
     * ```js
     * var ext = function(app) {
     *   app.core.hello = function() {  alert("Hello World") };
     * }
     * aura().use(ext).start('body');
     * ````
     *
     * #### Object litteral
     *
     * ```js
     * aura().use({
     *   require: {
     *     paths: {
     *       my_module: 'bower_components/my_module'
     *     }
     *   },
     *   initialize: function(app) {
     *     var MyModule = require('my_module');
     *     app.core.hello = function() {  alert("Hello World") };
     *   },
     *   afterAppStart: function() {
     *     console.warn("My Aura App is now started !");
     *   }
     * }).start('body');
     * ````
     *
     * The Object litteral form allows :
     *
     * * to add AMD dependencies
     * * to add App lifecycle callbacks (ex. `afterAppStart`)
     *
     * The extension provides the path mapping of its dependencies (backbone).
     * When the extension is used in an app, the ExtManager configures
     * requirejs with the right paths and requires all of them.
     *
     * Actually what it will do corresponds to (pseudo-code):
     *
     * ```
     * function requireExtension(ext) {
     *   require.config({ paths: { ... }, shim: { ... } })
     *   require(['backbone', 'underscore'], function(Backbone, _) {
     *     $.when(ext.initialize(app)).then( ... load next extension ... );
     *   })
     * }
     * ```
     *
     * When all the extension's dependencies are required, the extension's `initialized` method is called.
     * `ext.initialize` may return a promise, ExtManager wait for the result of `ext.initialize` resolution to load the next extension.
     *
     * When all the app's extensions are finally loaded, the extensions `afterAppStart` methods are then called.
     * then the app is considered ready and starts loading the Components !
     *
     * Note that after `app.start` has been called, it is not possible to register new extensions.
     *
     * *Example of an extension with an initialize method that returns a promise*
     *
     * Let's wrap Facebook's sdk as an Aura extension :
     *
     * ```js
     * var facebookExtension = {
     *   require: {
     *     paths: {
     *       facebook: 'http://connect.facebook.net/en_US/all.js'
     *     }
     *   },
     *
     *   initialize: function(app) {
     *     var status = app.core.data.deferred();
     *     app.sandbox.auth = {
     *       login: FB.login,
     *       logout: FB.logout
     *     };
     *     FB.init({ appId: 'xxx' });
     *
     *     FB.getLoginStatus(function(res) {
     *       app.sandbox.auth.loginStatus = res;
     *       status.resolve(res);
     *     }, true);
     *
     *     return status;
     *   },
     *
     *   afterAppStart: function(app) {
     *     console.warn("The app is started and I am : ", app.sandbox.auth.loginStatus);
     *   }
     * }
     *
     * aura().use(facebookExtension).start().then(function() {
     *   console.warn("My app is now started... and I am sure that getLoginStatus has been called and has returned somthing...");
     * });
     * ```
     *
     * This method can only be called before the App is actually started.
     * Note that the App is started when its `start` method is called.
     *
     * @method use
     * @param  {String | Object | Function} ref the reference of the extension
     * @return {Aura} the Aura app object
     * @chainable
     */
    app.use = function(ref) {
      extManager.add({ ref: ref, context: app });
      return app;
    };

    /**
     * Namespace for components related methods.
     *
     * @type {Object}
     */
    app.components = {};

    /**
     * Adds a new source for components.
     * A Component source is an endpoint (basically a URL)
     * that is the root of a component repository.
     *
     * @method  components.addSource
     * @param {String} name    the name of the source.
     * @param {String} baseUrl the base url for those components.
     */
    app.components.addSource = function(name, baseUrl) {
      if (config.sources[name]) {
        throw new Error("Components source '" + name + "' is already registered");
      }
      config.sources[name] = baseUrl;
      return app;
    };

    /**
     * `core` is just a namespace used by the extensions to add features to the App.
     *
     * @property {Object} core
     */
    app.core = Object.create(base);

    /**
     * Application start.
     *
     * Bootstraps the extensions loading process.
     * All the extensions are resolved and loaded when `start` id called.
     * Start returns a promis e that shall fail if any of the
     * extensions fails to load.
     *
     * The app's responsibility is to load its extensions,
     * make sure they are properly loaded when the app starts
     * and eventually make sure they are properly cleaned up when the app stops
     *
     * @method start
     * @param  {Object | String | Array} options start options.
     * @return {Promise} a promise that resolves when the app is started.
     */
    app.start = function(options) {

      if (app.started) {
        app.logger.error("Aura already started!");
        return extManager.initStatus;
      }

      app.logger.log("Starting Aura");

      var startOptions = options || {};

      // Support for different types of options (string, DOM Selector or Object)
      if (typeof options === 'string') {
        startOptions = { components: app.core.dom.find(options) };
      } else if (Array.isArray(options)) {
        startOptions = { components: options };
      } else if (options && options.widgets && !options.components) {
        startOptions.components = options.widgets;
      }

      extManager.onReady(function(exts) {
        // Then we call all the `afterAppStart` provided by the extensions
        base.util.each(exts, function(i, ext) {
          if (ext && typeof(ext.afterAppStart) === 'function') {
            ext.afterAppStart(app);
          }
        });
      });

      // If there was an error in the boot sequence we
      // reject every body an do some cleanup
      // TODO: Provide a better error message to the user.
      extManager.onFailure(function() {
        app.logger.error("Error initializing app:", app.config.name, arguments);
        app.stop();
      });

      app.startOptions = startOptions;
      app.started = true;

      // Finally... we return a promise that allows
      // to keep track of the loading process...
      return extManager.init();
    };

    /**
     * Stops the application and unregister its loaded dependencies.
     *
     * @method stop
     * @return {void}
     */
    app.stop = function() {
      // TODO: We ne to actually do some cleanup here.
      app.started = false;
    };

    /**
     * Sandboxes are a way to implement the facade pattern on top of the features provided by `core`.
     *
     * The `sandbox` property of an Aura App is just an Object that will be used
     * as a blueprint, once the app is started, to create new instances
     * of sandboxed environments for the Components.
     * @property {Object} sandbox
     */
    app.sandbox = baseSandbox;

    /**
     * App Logger
     *
     * @property {Logger} logger
     */
    app.logger     = new Logger(app.ref);

    /**
     * @class Sandbox
     */

    /**
     * Stop method for a Sandbox.
     * If no arguments provided, the sandbox itself and all its children are stopped.
     * If a DOM Selector is provided, all matching children will be stopped.
     *
     * @param  {undefined|String} DOM Selector
     */
    app.sandbox.stop = function(selector) {
      if (selector) {
        app.core.dom.find(selector, this.el).each(function(i, el) {
          var ref = app.core.dom.find(el).data('__sandbox_ref__');
          stopSandbox(ref);
        });
      } else {
        stopSandbox(this);
      }
    };

    function stopSandbox(sandbox) {
      if (typeof sandbox === 'string') {
        sandbox = app.sandboxes.get(sandbox);
      }
      if (sandbox) {
        var event = ['aura', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
        _.invoke(sandbox._children, 'stop');
        app.core.mediator.emit(event, sandbox);
        if (sandbox._component) {
          sandbox._component.invokeWithCallbacks('remove');
        }
        sandbox.stopped  = true;
        sandbox.el && app.core.dom.find(sandbox.el).remove();
        appSandboxes[sandbox.ref] = null;
        delete appSandboxes[sandbox.ref]; // do we need to actually call `delete` ?
        return sandbox;
      }
    }

    // Register core extensions : debug, mediator and components.
    config.debug = config.debug || {};
    var debug = config.debug;
    if (debug.enable) {
      if(debug.components){
        debug.components = debug.components.split(' ');
      }else{
        debug.components = [];
      }
      app.logger.enable();
      app.use('aura/ext/debug');
    }

    app.use('aura/ext/mediator');
    app.use('aura/ext/components');

    return app;
  }

  return Aura;
});
