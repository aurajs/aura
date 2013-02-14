# What is an extension? / What is an app ?


the application instance of aura. 
accepts configuration.

manages the loading of extensions.

bring the widgets to life.


### Anatomy of an app

app public interface : 

- `use(ref)` : entry point to add an extension
- `registerWidgetsSource(name, baseUrl)` : adds a new endpoint to load widgets
- `start(options)` : starts the app
- `stop()` : stop the app. & should be responsible for cleanup (not implemented yet...)

The app's responsibility is to load a bunch of extensions, 
make sure they are properly loaded when the app starts
make sure they are properly cleaned up when the app stops

The extensions are there to provide a runtime for the widgets that the app starts.

### Lifecycle of an app

#### Before app.start

    var app = aura(config);
    app.use('ext1').use('ext2');
    app.registerWidgetsSource('http://my.external/widgets/store', 'superwidgets');
    app.start();

internally the app wraps 3 important objects : `config`, `core`, `sandbox`

- `config` is the object passed as first param of the apps constructor
- `core`   is a container where the extensions add new features
- `sandbox` is an object that will be used as a prototype, to create fresh sandboxes to the widgets


*The sandbox object*
`sandbox` is just way to implement the facade pattern on top of features provided by `core`
the key ideas here is that it's just a blueprint (/ or factory) that will be used, once the app is 
started to make new instances of sandboxed environments for the widgets. 



#### on app.start

`app.start` launches the app init process

`app.extensions` is an instance of `ExtManager` and handles all the grunt work of loading extensions

`app.extensions.init` returns a promise that resolves when all the extensions have been loaded, which signals the app 
that it can start launching widgets !

#### on app.stop

here, all the widgets started by the app should be stopped. 
and all the dependencies loaded by the app extensions should be cleaned up

_this is not implemented yet..._


### What's the difference between an extension and sandbox / widget

#### 2.1 what it can augment in aura

aura extensions are loaded in the app during init.
they are responsible for : 

- resolving & loading external dependencies via requirejs
- they have a direct access to the app's internals
- they are here to add new features to the app... that are made available through the sandboxes to the widgets.


Extensions can have multiple forms : 

*Module name*

    aura().use('my/ext')

*Function*

    var ext = function(app) {
      app.core.hello = function() {  alert("Hello World") };
    }
    aura().use(ext);

*Object litteral*

    var ext = {
      require: {},
      initialize: function(app) {
        app.core.hello = function() {  alert("Hello World") };
      }
    }
    aura().use(ext);


The Object litteral form allows : 

- to add dependencies 
- to add lifecycle callbacks (ex. `afterAppStart`)

here is an example of a very simple backbone extension:

    define(function() {
      var historyStarted = false;
      var ext = {
        require: {
          paths: {
            backbone:     'components/backbone/backbone'
            underscore:   'components/underscore/underscore'
          },
          shim: {
            backbone: { exports: 'Backbone', deps: ['underscore'] }
          }
        },
        initialize: function(app) {
          app.core.mvc = require('backbone');
          app.sandbox.View = function(view) { return app.core.mvc.View.extend(view); }
        },
        afterAppStart: function(app) {
          if (historyStarted) return;
          Backbone.history.start();
          historyStarted = true;
        }
      }
      return ext;
    });

The extension provides the path mapping of its dependencies (backbone).
When the extension is used in an app, the ExtManager configures 
requirejs with the right paths and requires all of them.

Actually what it will do corresponds to (pseudo-code): 
    
    function requireExtension(ext) {
      require.config({ paths: { ... }, shim: { ... } })
      require(['backbone', 'underscore'], function(Backbone, _) {
        $.when(ext.initialize(app)).then( ... load next extension ... );
      })      
    }


When all the extension's dependencies are required, the `init` method is called.
`ext.init` may return a promise, ExtManager wait for `ext.init` resolution to load the next extension.

When all the app's extensions are finally loaded, the extensions `ext.afterAppStart` methods are then called.

... then the app is considered ready !

After `app.start` has been called, it is not possible to register new extensions.

*Example of an extension with an initialize method that returns a promise*

Let's wrap FB sdk as an aura extension : 

    var facebookExtension = {
      
      require: {
        paths: {
          facebook: 'http://connect.facebook.net/en_US/all.js'
        }
      },

      initialize: function(app) {
        var status = app.core.data.deferred();
        app.sandbox.auth = {
          login: FB.login,
          logout: FB.logout
        };
        
        FB.init({ appId: 'xxx' });
        
        FB.getLoginStatus(function(res) {
          app.sandbox.auth.loginStatus = res;
          status.resolve(res);
        }, true);

        return status;
      },

      afterAppStart: function(app) {
        console.warn("The app is started and I am : ", app.sandbox.auth.loginStatus);
      }

    }

    aura().use(facebookExtension).start().then(function() {
      console.warn("My app is now started... and I am sure that getLoginStatus has been called and has returned somthing...");
    });


#### 2.2 what it can execute in 

#####  2.2.a aura core 

extensions are here to provide features that will be used by the widgets...
they are meant to extend the apps' core & sandbox.
they also have access to the apps's config.

#####  2.2.b other widgets 

the extensions don't actually execute code in the widgets.
They are all run before the first widget is even instantiated.

#####  2.2.c both

...

#### 2.3 what can they view / read  in 

#####  2.3.a aura core 

everything... they have a direct access to the app object.

#####  2.3.b other widgets 

they don't know anything directly about the widgets

#####  2.3.c both  

...


#### 2.4 where it's initialized in aura

extensions are referenced and initialized by the app's ExtManager instance.

#### 2.5 where it's stored/kept in aura's variable/processes

not stored... we just have a reference somewhere, but extensions are just code that is run at init time






-------------------------

## Aura Core extensions

### Debug

debug extension to provide feedback to the developers.
if app.config.debug = true then debug is activated.

- what tools are here? loggers? read eval print loop?
- are they cross-browser compatible? to what version?

For the moment... nothing much here, but we should provide strong debugging tools 
here


### Mediator

App pubsub / mediator pattern. Provides a central point of communication... blablabla

- this is the pubsub?

yep, very minimal for the moment too...
came accross postal.js which seems an interesting candidate to replace ee2 (smaller, more modular...).

An other idea to have a rich api on top of the mediator, would be to have a middleware stack around it
It would allow us to implement the permissions system as a middleware for example.


- can does mediator handle any other functionality other than pubsub?

### Widgets

Widgets features...


## Questions

- is there a standard if an extensions sholuld be a single file? 

not really. did not have to split yet in the extensions i have written so far.

- couldn't an extension technically be multiple files, in a git submodule, requiring multiple dependencies / be split into files?

yep

- can extensions in core be extended ?

extensions are just object litterals.. so yeah, i guess they should be easy to extend thmselves
 
- are extensions in core versioned ?

they should be versionned with aura, i think.

- should extensions in core themselves be git projects that can be downloaded with bower ?

`ext/widgets` and `ext/mediator` are the core of aura... for the moment they are distributed with 
aura and added by default.

personnaly i already came up with a real use case where i used aura-express without the widgets features. 
so we could maybe make the widgets ext optional. 

`ext/mediator` should always be here i think...


- should extensions in core/contrib follow the way of grunt-contrib-*'s extensions and be versioned?

i think we should have a collection of extensions that each live on their own repo under the aurajs org... like grunt does...
