define([
  './base',
  './aura.extensions'
  ], function(base, ExtManager) {

  var _ = base.util._,
      noop     = function() {},
      freeze   = Object.freeze || noop;

  /**
  * Aura constructor and main entry point
  * Loads mediator & widgets extensions by default.
  */
  function Aura(config) {

    if (!(this instanceof Aura)) { 
      return new Aura(config);
    }
    
    this.ref        = _.uniqueId('aura_');
    this.config     = config = config || {};
    this.extensions = new ExtManager(this.ref, config.require);

    this.core       = Object.create(base);
    this.sandbox    = Object.create(base);

    if (config.debug) { this.use('aura/ext/debug'); }
    this.use('aura/ext/mediator');

    config.widgets = (config.widgets || {});
    config.widgets.sources = (config.widgets.sources || { "default" : "widgets" });
    this.use('aura/ext/widgets');
    
    return this;
  }


  /**
   * Creates a brand new sandboxe, using the app sandbox object as a prototype
   *
   */
  Aura.prototype.createSandbox = function() {
    return Object.create(this.sandbox);
  };

  /**
   * Tells the app to init with the given extension.
   *
   * This method can only be called before the app is actually started.
   *
   * @param  {String|Object|Function} ref the reference of the extension
   * @return {Aura}   the Aura app object
   */
  Aura.prototype.use = function(ref) {
    this.extensions.add({ ref: ref, context: this });
    return this;
  };

  /**
   * Adds a new source for widgets
   * 
   * @param {String} name    the name of the source
   * @param {String} baseUrl the base url for those widgets
   */
  Aura.prototype.registerWidgetsSource = function(name, baseUrl) {
    if (this.config.widgets.sources[name]) {
      throw new Error("Widgets source '" + name + "' is already registered");
    }
    this.config.widgets.sources[name] = baseUrl;
    return this;
  };


  /**
   * Application start.
   * Bootstraps the extensions loading process
   * @return {Promise} a promise that resolves when the app is started
   */
  Aura.prototype.start = function(options) {
    var app = this;

    if (app.started) {
      console.error("Aura already started... !");
      return app.extensions.initStatus;
    }

    app.startOptions  = options || {};
    app.started       = true;

    app.extensions.onReady(function(exts) {

      // Then we call all the `afterAppStart` provided by the extensions
      base.util.each(exts, function(i, ext) {
        if (ext && typeof(ext.afterAppStart) === 'function') {
          try {
            ext.afterAppStart(app);  
          } catch(e) {
            console.error("Error on ", (ext.name || ext) , ".afterAppStart callback: (", e.message, ")", e);
          }
        }
      });        
      // freeze(app.sandbox);
      // freeze(app.core);
    });

    // If there was an error in the boot sequence we 
    // reject every body an do some cleanup
    // TODO: Provide a better error message to the user.
    app.extensions.onFailure(function() {
      console.error("Error initializing app...", app.config.name, arguments);
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
   * @return {void}
   */
  Aura.prototype.stop = function() {
    this.started = false;
    
    // unregisterDeps(this.ref, Object.keys(allDeps.apps[env.appRef] || {}));
  };


  return Aura;
});
