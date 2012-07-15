##Aura 0.8 Developer Preview ![GruntBuild](https://secure.travis-ci.org/addyosmani/backbone-aura.png?branch=master) - [TravisCI Build Info](https://secure.travis-ci.org/addyosmani/backbone-aura?branch=master)
 
Aura is a decoupled, event-driven architecture for developing widget-based applications. It takes advantage of patterns and best practices for developing maintainable applications and gives you greater control over widget-based development. Aura gives you complete control of a widget's lifecycle, allowing developers to dynamically start, stop, reload and clean-up parts of their application as needed.

The project is based on concepts discussed by Nicholas Zakas in [Scalable Application Architecture](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture) and by Addy in [Large-scale Application Development](http://addyosmani.com/largescalejavascript/).

Aura contains a multi-tiered architecture, consisting of:

* **Application Core**
* **Sandbox**
* **Modules**
  * **Widgets**

### Application Core

The Core has a number of responsibilities. Powered by the Mediator pattern, it:

* **Provides the ability to manage a widget's lifecycle (start, stop, cleanup)**. This is powered by work we've done to expand on top of RequireJS 2.0's `undef` feature for unloading modules. Aura works around RequireJS's limitation of not being able to resolve a modules dependencies to allow the easy unloading of an entire widget. Unloading a widget equates to removing it from the RequireJS caches, deleting instance references to them (which can lower memory) and of course, cleaning up any DOM elements the widget was using.
* **Implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice**. The idea here is that rather than interfacing with the libraries directly, accessing the Core aliases (through the Sandbox) allow developers to switch out the libraries they use at a later date with minimum impact to their application.
* **Exposes Publish/Subscribe functionality that can be used for decoupled communication between parts of an application**. Similar to the concept above, our Pub/Sub implementation can be easily replaced with that of another library and it should still work fine.

### Sandbox

Powered by the Facade pattern, the Sandbox:

* **Provides a limited, lightweight API layer on top of the Core for the rest of an application to communicate through**. Rather than exposing say, the entire API for a JavaScript library, we instead only expose those parts that developers in the project will need or are safe to use. This is particularly useful when working in teams.
* The Sandbox includes a permissions layer, allowing you to configure permissions for widgets such as whether a specific widget has the right to render to the page etc.

### Modules

* **All of the files and demo widgets in Aura use AMD as their module format of choice**
* These can of course be used with r.js for compilation and optimization if concerned about too many script files (compilation should always be used for production-level apps if using AMD in any situation)
* Whilst not an Aura feature, we also take advantage of RequireJS 2.0's `shim` capability to avoid the need to use patched versions of Backbone.js and Underscore.js (a concern with earlier versions of the project).

 ### Widgets

* Widgets represent a complete *unit* of a page. They could be a calendar, a news block, a todo list or anything else. 
* **In Backbone.js terms, widgets are composed of Models, Views, Collections and Routers as well as any templates needed for the widget to rendered.**
* Widgets should be developed such that any number of instances of them could exist on a page in harmony. 
* **Publish/Subscribe can be used to communicate between widgets**. Alternatively, direct communication (as demonstrated by the `controls` widget in our examples) may be, however this is discouraged where Pub/Sub can be used instead.

## Sample Application

A demo application using Aura is included in the download featuring Calendar, Todo list and control widgets. After you complete **Install & Build section** (see bellow), run `grunt launch` to launch web server on `http://localhost:8888` and go to `demo` directory to try the demo app out.

![Screenshot](http://i.imgur.com/wAff1.png)

We plan on writing up a more complex application using Aura as soon as a stable release is ready. We'll ensure it uses multiple views and handles some of the more challenging architectural issues developers commonly run into today.



### Code Samples

#### Starting and stopping a Widget

```javascript
    startCalendar: function(){
      sandbox.widgets.start('calendar', '#calendarapp');
    },

    stopCalendar: function(){
      sandbox.widgets.stop('calendar', '#calendarapp');
    }
```


#### Pulling together a Widget

```javascript
define(['sandbox', './views/app', './collections/events', 'fullcalendar'], 
  function(sandbox, AppView, Events){
    return sandbox.subscribe('bootstrap', 'calendar', function (element) {
        var events = new Events();
        new AppView({el: sandbox.dom.find(element), collection: events}).render();
        events.fetch();
    });
});
```

#### Collections using the Sandbox

```javascript
define(['sandbox', '../models/event'], function(sandbox, Event){

    var Events = sandbox.mvc.Collection({
        model: Event,
        // url: 'events'
        // Save all of the calendar items under the `"events"` namespace.
        localStorage: new sandbox.data.Store("events-backbone-require")
    }); 
    
    return Events;
});
```


#### Views using the Sandbox

```javascript
define(['sandbox', './event', '../models/event', 'text!../templates/base.html'],
        function(sandbox, EventView, Event, baseTemplate) {

    var AppView = sandbox.mvc.View({

        baseTemplate: sandbox.template.parse(baseTemplate),

        initialize: function(){

            // $el and $() are actually proxying 
            // through to sandbox.dom.find()
            this.$el.html(baseTemplate);
            
            this.calendar = this.$(".content");
            
            sandbox.events.bindAll(this); 
```

#### Sandbox Extension For Backbone

```javascript
define(["aura_sandbox", "core", "perms", 'jquery_ui'],
    function (sandbox, core, perms) {

        var facade = Object.create(sandbox);
        facade.data.Store = core.data.Store;
        facade.mvc = {};
        facade.widgets = {};

        facade.mvc.View = function (view) {
            return core.mvc.View.extend(view);
        };
        facade.mvc.Model = function (model) {
            return core.mvc.Model.extend(model);
        };
        facade.mvc.Collection = function (collection) {
            return core.mvc.Collection.extend(collection);
        };

        facade.widgets.start = function(channel, el){
            return sandbox.start.apply(this, arguments);
        };

        facade.widgets.stop = function(channel, el){
            return sandbox.stop.apply(this, arguments);
        };

        return facade;
});

```

### Aura Directory Structure

*-- /aura*

Contains the core implementation of the Application Core (mediator.js), Sandbox (facade.js) and base for widget Permissions validation (permissions.js). 

*-- /backbone-aura*

Extensions to the Application Core, Sandbox and Permissions can be found here. These contain example specific extensions such as support for Backbone.js and bootstrap/load permissions for the example's widgets.

*-- /demo*

The demo/example application containing three sample widgets: Calendar, Todos and Controls. Both the Calendar and Todos persist using localStorage whilst the Controls widget is there to just demonstrate how one could control the start and stop of widgets through the UI. Normally this process would be handled by modules.

*-- /config.js*

RequireJS 2.0 configuration, including `shim` config to allow the loading of non AMD-patched versions of libraries such as Underscore.js and Backbone.js. This is the initial point of starting up the widgets for an application. 


##API

**Core**

* `mediator.start(channel, el)` e.g mediator.start('calendar', '#calendarapp')
* `mediator.stop(channel, el)` e.g mediator.stop('calendar', #calendarapp')
* `mediator.unload(channel)` e.g mediator.unload('calendar')
* `mediator.publish(channel)` 
* `mediator.subscribe(channel, callback, context)`
* `mediator.util.each()` => _.each()
* `mediator.util.extend()` => _.extend()
* `mediator.util.method(fn, context)`
* `mediator.util.parseJSON()`
* `mediator.util.rest(arr, index)`
* `mediator.util.delay()`
* `mediator.dom.find(selector, context)` => $(..)
* `mediator.dom.data(selector, attribute)` => $(..).data()
* `mediator.events.listen(context, events, selector, callback)`
* `mediator.events.bindAll()`
* `mediator.data.deferred()` => $.Deferred
* `mediator.template.parse()` => _.template() (can be switched out)


**Sandbox**

* `facade.start(channel, el)`
* `facade.stop(channel, el)`
* `facade.publish(channel)`
* `facade.subscribe(subscriber, channel, callback)`
* `facade.dom.find(selector, context)`
* `facade.events.listen(context,events,selector,callback)`
* `facade.events.bindAll()`
* `facade.util.each(..)`
* `facade.util.rest(..)`
* `facade.util.delay(..)`
* `facade.util.extend(..)`
* `facade.template(..)`

**Permissions**

* `permissions.extend(extension)`
* `permissions.validate(subscriber, channel)`

## Backbone Extensions For Aura

**Core**

* `mediator.data.Store` => Backbone localStorage adapter
* `mediator.mvc` => Backbone

**Sandbox**

* `facade.mvc.View`
* `facade.mvc.Model`
* `facade.mvc.Collection`
* `facade.widgets.start(channel, el)`
* `facade.widgets.stop(channel, el)`

**Permissions**

* Bootstrap permissions to display/render for specific widgets (e.g `permissions.todos: {bootstrap: true}`)

### Install & Build

Aura uses [grunt](https://github.com/cowboy/grunt) & [require.js](https://github.com/jrburke/requirejs) for linting & building.
If you want to build Aura, you first have to install grunt:

```shell
npm install grunt -g
```
then Auras own dependencies [grunt-contrib](https://github.com/gruntjs/grunt-contrib), [grunt-requirejs](https://github.com/asciidisco/grunt-requirejs) and [grunt-jasmine-task](https://github.com/creynders/grunt-jasmine-task) like so:

```shell
cd /your/path/to/aura
npm install
```

also, in order for the [grunt-jasmine-task](https://github.com/creynders/grunt-jasmine-task) to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. The easiest way to install PhantomJs is using [Homebrew](https://github.com/mxcl/homebrew) with its [updated formula](https://github.com/mxcl/homebrew/pull/11225) for PhantomJS:

```shell
brew update
brew install phantomjs
```

In case you can't or don't want to use [Homebrew](https://github.com/mxcl/homebrew) there are a number of other ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

Now you've set up everything to start building Aura, to do so, just run

```shell
grunt build
```
in the same directory where the grunt.js file lies.

### Why A Developer Preview?

Aura is currently missing two important items needed to help us get out a stable release. These are good unit tests and stronger documentation. When the project has these and we've confirmed everything works as expected, we'll announce it for others to check out. The developer preview is our way of letting developers play with some new toys early on and get community feedback on whether the project is useful or not. 

At minimum it offers a reference application for some of the ideas Nicholas and Addy have spoken and written about in the past. We welcome your thoughts and any feedback on the project. Thanks!

### Team

* [Addy Osmani](http://github.com/addyosmani)
* [Dustin Boston](http://github.com/dustinboston)
* [Gerson Goulart](http://github.com/gersongoulart)
* [Peter Rudolfsen](http://github.com/rudolfrck)
* [Robert Djurasaj](http://github.com/robertd)

### License

Aura is released under a public domain license.
