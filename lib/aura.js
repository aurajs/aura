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
  * Loads mediator & components extensions by default.
  *
  * @class Aura
  * @constructor
  * @param {Object} [config]. Main App config.
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
   * @method createSandbox
   * @param [ref] {String} the Sandbox unique ref.
   * @param [options] {Object} an object to that directly extends the Sandbox
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
   * @param {String} ref the Sandbox ref to retreive.
   */
  Aura.prototype.getSandbox = function(ref) {
    return this.sandboxes[ref];
  };

  /**
   * Tells the app to init with the given extension.
   *
   * This method can only be called before the app is actually started.
   *
   * @method use
   * @param  {String|Object|Function} ref the reference of the extension
   * @return {Aura}   the Aura app object
   * @chainable
   */
  Aura.prototype.use = function(ref) {
    this.extensions.add({ ref: ref, context: this });
    return this;
  };

  /**
   * Adds a new source for components
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
   * Bootstraps the extensions loading process
   *
   * @method start
   * @param {Object|String|Array} options. start options.
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
   * TODO: We need to do a little more cleanup here...
   *
   * @method stop
   * @return {void}
   */
  Aura.prototype.stop = function() {
    this.started = false;
  };

  return Aura;
});
