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
  * programmatically or by iway of confifuration).
  *
  * An Aura application is the glue between all the extensions
  * and components inside its instance.
  *
  * Internally an Aura application wraps 4 important objects:
  *
  *- `config` is the object passed as the first param of the apps constructor
  *- `core`   is a container where the extensions add new features
  *- `sandbox` is an object that will be used as a prototype, to create fresh sandboxes to the components
  *- `extensions` An instance of the ExtensionManager. It contains all the extensions that will be loaded in the app.
  *     Extensions are here to provide features that will be used by the components...
  *     They are meant to extend the apps' core & sandbox.
  *     They also have access to the apps's config.
  *
  * Example of a creation of an Aura Application:
  *
  *     var app = aura(config);
  *     app.use('ext1').use('ext2');
  *     app.registerComponentsSource('http://my.external/components/store', 'supercomponents');
  *     app.start();
  *
  * @class Aura
  * @param {Object} [config] Main App config.
  * @method constructor
  */
  function Aura(config) {
    if (!(this instanceof Aura)) {
      return new Aura(config);
    }

    this.ref        = _.uniqueId('aura_');
    this.config     = config || {};
    this.extensions = new ExtManager();

    this.core       = Object.create(base);
    this.sandbox    = Object.create(base);
    this.sandboxes  = {};
    this.logger     = new Logger(this.ref);

    this.config.debug = this.config.debug || {};
    var debug = this.config.debug;
    if (debug.enable) {
      if(debug.components){
        debug.components = debug.components.split(' ');
      }else{
        debug.components = [];
      }
      this.logger.enable();
      this.use('aura/ext/debug');
    }

    this.use('aura/ext/mediator');

    this.config.components = (this.config.components || {});
    this.config.components.sources = (this.config.components.sources || { "default" : "aura_components" });
    this.use('aura/ext/components');

    return this;
  }

  /**
   * Creates a brand new sandbox, using the App's sandbox object as a prototype.
   *
   * A sandbox is a way to implement the facade pattern on top of the features provided by `core`
   * The `sandbox` property of an Aura application is just a blueprint (/ or factory) that will be used
   * as a prototype, once the app is started, to create new instances
   * of sandboxed environments for the components.
   *
   * @method createSandbox
   * @param {String} [ref]      the Sandbox unique ref.
   * @param {Object} [options]  an object to that directly extends the Sandbox
   * @return {Sandbox} a shiny new Sandbox instance.
   */
  Aura.prototype.createSandbox = function(ref, options) {
    var sandbox = Object.create(this.sandbox);
    sandbox.ref = ref || _.uniqueId('sandbox-');
    sandbox.logger = new Logger(sandbox.ref);
    if (this.sandboxes[sandbox.ref]) {
      throw new Error("Sandbox with ref " + ref + " already exists.");
    }
    this.sandboxes[sandbox.ref] = sandbox;
    var debug = this.config.debug;
    if(debug.enable && (debug.components.length === 0 || debug.components.indexOf(ref) !== -1)){
      sandbox.logger.enable();
    }
    _.extend(sandbox, options || {});
    return sandbox;
  };


  /**
   * Get a sandbox by its reference
   *
   * @method getSandbox
   * @param {String} ref    the Sandbox ref to retreive.
   */
  Aura.prototype.getSandbox = function(ref) {
    return this.sandboxes[ref];
  };

  /**
   * Tells the app to load the given extension.
   *
   *  aura extensions are loaded in the app during init.
   *  they are responsible for :
   *
   *  - resolving & loading external dependencies via requirejs
   *  - they have a direct access to the app's internals
   *  - they are here to add new features to the app... that are made available through the sandboxes to the components.
   *
   *
   *
   *  Extensions can have multiple forms :
   *
   ** *Module name*
   *
   * ````
   * aura().use('my/ext')
   *````
   *
   ** *Function*
   *
   * ````
   *var ext = function(app) {
   *  app.core.hello = function() {  alert("Hello World") };
   *}
   *aura().use(ext);
   *````
   ** *Object litteral*
   *
   *````
   *var ext = {
   *  require: {},
   *  initialize: function(app) {
   *    app.core.hello = function() {  alert("Hello World") };
   *  }
   *}
   *aura().use(ext);
   *````
   *
   *  The Object litteral form allows :
   *
   *  - to add dependencies
   *  - to add lifecycle callbacks (ex. `afterAppStart`)
   *
   *  here is an example of a very simple backbone extension:
   *
   *````
   *define(function() {
   *  var historyStarted = false;
   *  var ext = {
   *    require: {
   *      paths: {
   *        backbone:     'components/backbone/backbone'
   *        underscore:   'components/underscore/underscore'
   *      },
   *      shim: {
   *        backbone: { exports: 'Backbone', deps: ['underscore'] }
   *      }
   *    },
   *    initialize: function(app) {
   *      app.core.mvc = require('backbone');
   *      app.sandbox.View = function(view) { return app.core.mvc.View.extend(view); }
   *    },
   *    afterAppStart: function(app) {
   *      if (historyStarted) return;
   *      Backbone.history.start();
   *      historyStarted = true;
   *    }
   *  }
   *  return ext;
   *});
   *````
   *
   *  The extension provides the path mapping of its dependencies (backbone).
   *  When the extension is used in an app, the ExtManager configures
   *  requirejs with the right paths and requires all of them.
   *
   *  Actually what it will do corresponds to (pseudo-code):
   *
   *      function requireExtension(ext) {
   *        require.config({ paths: { ... }, shim: { ... } })
   *        require(['backbone', 'underscore'], function(Backbone, _) {
   *          $.when(ext.initialize(app)).then( ... load next extension ... );
   *        })
   *      }
   *
   *
   *  When all the extension's dependencies are required, the `init` method is called.
   *  `ext.init` may return a promise, ExtManager wait for `ext.init` resolution to load the next extension.
   *
   *  When all the app's extensions are finally loaded, the extensions `ext.afterAppStart` methods are then called.
   *
   *  ... then the app is considered ready !
   *
   *  After `app.start` has been called, it is not possible to register new extensions.
   *
   *  *Example of an extension with an initialize method that returns a promise*
   *
   *  Let's wrap FB sdk as an aura extension :
   *
   *      var facebookExtension = {
   *
   *        require: {
   *          paths: {
   *            facebook: 'http://connect.facebook.net/en_US/all.js'
   *          }
   *        },
   *
   *        initialize: function(app) {
   *          var status = app.core.data.deferred();
   *          app.sandbox.auth = {
   *            login: FB.login,
   *            logout: FB.logout
   *          };
   *
   *          FB.init({ appId: 'xxx' });
   *
   *          FB.getLoginStatus(function(res) {
   *            app.sandbox.auth.loginStatus = res;
   *            status.resolve(res);
   *          }, true);
   *
   *          return status;
   *        },
   *
   *        afterAppStart: function(app) {
   *          console.warn("The app is started and I am : ", app.sandbox.auth.loginStatus);
   *        }
   *
   *      }
   *
   *      aura().use(facebookExtension).start().then(function() {
   *        console.warn("My app is now started... and I am sure that getLoginStatus has been called and has returned somthing...");
   *      });
   * This method can only be called before the app is actually started.
   * Note that the app is started when its `start` method is called.
   *
   * @method use
   * @param  {String | Object | Function} ref the reference of the extension
   * @return {Aura} the Aura app object
   * @chainable
   */
  Aura.prototype.use = function(ref) {
    this.extensions.add({ ref: ref, context: this });
    return this;
  };

  /**
   * Adds a new source for components.
   * A Component source is an endpoint (basically a URL)
   * that is the root of a component repository.
   *
   * @method  registerComponentsSource
   * @param {String} name    the name of the source.
   * @param {String} baseUrl the base url for those components.
   */
  Aura.prototype.registerComponentsSource = function(name, baseUrl) {
    if (this.config.components.sources[name]) {
      throw new Error("Components source '" + name + "' is already registered");
    }
    this.config.components.sources[name] = baseUrl;
    return this;
  };

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
   * @param {Object | String | Array} options start options.
   * @return {Promise} a promise that resolves when the app is started.
   */
  Aura.prototype.start = function(options) {
    var app = this;

    if (app.started) {
      app.logger.error("Aura already started... !");
      return app.extensions.initStatus;
    }
    app.logger.log("Starting Aura...");

    var startOptions = options || {};

    if (typeof options === 'string') {
      startOptions = { components: app.core.dom.find(options) };
    } else if (Array.isArray(options)) {
      startOptions = { components: options };
    } else if (options && options.widgets && !options.components) {
      startOptions.components = options.widgets;
    }

    app.startOptions = startOptions;

    app.started       = true;

    app.extensions.onReady(function(exts) {

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
    app.extensions.onFailure(function() {
      app.logger.error("Error initializing app...", app.config.name, arguments);
      app.stop();
    });

    // Finally... we return a promise that allows
    // to keep track of the loading process...
    //

    return app.extensions.init();
  };

  /**
   * Stops the application and unregister its loaded dependencies.
   *
   * @TODO: We need to do a little more cleanup here...
   *
   * @method stop
   * @return {void}
   */
  Aura.prototype.stop = function() {
    this.started = false;
  };

  return Aura;
});
