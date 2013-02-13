### is there a test suite format where aura extensions can be tested in a self-contained way ?

The extension format should not depend on aura.app itself.
Theoretically, an extension can extend any javascript object.
Some extensions can depend on other extensions though... 
we don't really have a way to express that for the moment.


example :

    var app = {},
        mgr = new ExtManager,
        ext1 = function(a) { a.stuff = {} },
        ext2 = function(a) { a.stuff.foo = "bar" };
    mgr.add({ ref: ext1, context: app });
    mgr.add({ ref: ext2, context: app });
    mgr.init();
    app.stuff.foo.should == 'bar';



### is there a test suite format where aura extensions can be tested in integration with aura / other loaded extensions?

### is there a test suite format where aura extensions can be tested in integration with aura / other loaded extensions + widgets?

### is there a skeleton available / that can be used for gitsubmodules / etc to make extensions and widgets?

we could have something like :

    my-ext/
      component.json
      my-ext.js

with, component.json would list all the extensions' deps

and to assemble it in an app : 

    my-app/
      component.json
      main.js


where the app's component.json : 

    {
      name: 'my-app',
      main: 'main.js'
      dependencies: {
        aura: '*',
        my-ext: '*'
      }
    }

and in main: 

    define(['aura/aura'], function() {
      var app = aura();
          app.use('components/my-ext/my-ext').start();
    })


### Tooling

* is there any tools available / we can create on top of grunt to aid with making a test suite for extensions ?
* is there any tools available /  we can create on top of grunt to aid with making a test suite for sandboxes / widgets ?
* is there a way a grunt tool / app.json / project.json that be can used with a custom bower directory to wrap a project's dependencies?


It definitely would be nice to have grunt based tools to help with :

- the creation & distribution of extensions
- the creation & build of apps


It will be `mandatory` to have build tools to package and distribute widgets though... if we want to be able to load widgets 
from different sources / origins (mostly because of limitations on the loading of text! files cross-domain).



