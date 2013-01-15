##Aura 0.8.9 Developer Preview [![Build Status](https://secure.travis-ci.org/aurajs/aura.png?branch=master)](http://travis-ci.org/aurajs/aura)

<img width="350" src="https://raw.github.com/hull/aura-identity/master/logo/export/halo.png"/>

Aura is a decoupled, event-driven architecture for developing widget-based applications. It takes advantage of patterns and best practices for developing maintainable applications and gives you greater control over widget-based development. Aura gives you complete control of a widget's lifecycle, allowing developers to dynamically start, stop, reload and clean-up parts of their application as needed.

The project is based on concepts discussed by Nicholas Zakas in [Scalable Application Architecture](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture) and by Addy in [Large-scale Application Development](http://addyosmani.com/largescalejavascript/).

Aura contains a multi-tiered architecture, consisting of:

* **Application Core**
  * **Base Library**
* **Sandbox**
* **Modules**
  * **Widgets**

### Application Core

The Core has a number of responsibilities. Powered by the Mediator pattern, it:

* **Provides the ability to manage a widget's lifecycle (start, stop, cleanup)**. This is powered by work we've done to expand on top of RequireJS 2.0's `undef` feature for unloading modules. Aura works around RequireJS's limitation of not being able to resolve a module's dependencies to allow the easy unloading of an entire widget. Unloading a widget equates to removing it from the RequireJS caches, deleting instance references to them (which can lower memory) and of course, cleaning up any DOM elements the widget was using.
* **Implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice**. The idea here is that rather than interfacing with the libraries directly, accessing the Core aliases (through the Sandbox) allow developers to switch out the libraries they use at a later date with minimum impact to their application. We currently provide a bare-bones implementation of the jQuery library.
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

* A Widget represents a complete *unit* of a page. It could be a calendar, a news block, a todo list or anything else.
* **In Backbone.js terms, widgets are composed of Models, Views, Collections and Routers as well as any templates needed for the widget to be rendered.**
* Widgets should be developed such that any number of instances of them could exist on a page in harmony.
* **Publish/Subscribe can be used to communicate between widgets**. Alternatively, direct communication (as demonstrated by the `controls` widget in our examples) may be done, however this is discouraged where Pub/Sub can be used instead.

## Sample Application

A demo application using Aura is included in the download featuring Calendar, Todo list and control widgets. After you complete **Install & Build section** (see below), run `grunt launch` to launch web server on `http://localhost:8888` and go to the `src` directory to try out the demo app.

![Screenshot](http://i.imgur.com/wAff1.png)

We plan on writing up a more complex application using Aura as soon as a stable release is ready. We'll ensure it uses multiple views and handles some of the more challenging architectural issues developers commonly run into today.



### Code Samples

#### Starting and stopping a Widget

```javascript
    startCalendar: function(){
      sandbox.widgets.start('calendar', { element: '#calendarapp' });
    },

    stopCalendar: function(){
      sandbox.widgets.stop('calendar', { element: '#calendarapp' });
    }
```


#### Pulling together a Widget

```javascript
define(['sandbox', './views/app', './collections/events', 'fullcalendar'],
  function(sandbox, AppView, Events){
    return sandbox.on('bootstrap', 'calendar', function (element) {
        var events = new Events();
        new AppView({el: sandbox.dom.find(options.element), collection: events}).render();
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

*-- /apps/dist*

The demo/example application containing three sample widgets: Calendar, Todos and Controls.

*-- /aura*

Contains the core implementation of the Application Core (mediator.js), Sandbox (facade.js) and base for widget Permissions validation (permissions.js).

*-- /extensions*

Extensions to the Application Core, Sandbox and Permissions can be found here. These contain example specific extensions such as support for Backbone.js and bootstrap/load permissions for the example's widgets.

*-- /widgets*

Standard place to put widgets code. Contains sample widgets: Calendar, Todos and Controls. Both the Calendar and Todos persist using localStorage whilst the Controls widget is there to just demonstrate how one could control the start and stop of widgets through the UI. Normally this process would be handled by modules.

*-- /config.js*

RequireJS 2.0 configuration, including `shim` config to allow the loading of non AMD-patched versions of libraries such as Underscore.js and Backbone.js. This is the initial point of starting up the widgets for an application.


##API

**Core**

* `mediator.start(channel, options)` e.g mediator.start('calendar', { element: '#calendarapp' })
* `mediator.stop(channel, el)` e.g mediator.stop('calendar', #calendarapp')
* `mediator.unload(channel)` e.g mediator.unload('calendar')
* `mediator.emit(channel)`
* `mediator.on(channel, callback, context)`

**Base Library (jQuery)**

* `mediator.util.each()` => $.each(collection, callback(indexInArray, valueOfElement))
* `mediator.util.extend()` => $.extend(target [, object1] [, objectN])
* `mediator.dom.find(selector, context)` => $(selector)
* `mediator.dom.data(selector, attribute)` => $(selector).data()
* `mediator.events.listen(context, events, selector, callback)` => $(context).on(events, selector, callback)
* `mediator.events.bindAll()` => _.bindAll(object [, method1] [, methodN])
* `mediator.data.deferred()` => $.Deferred()
* `mediator.data.when()` => $.when(deferreds)
* `mediator.template.parse()` => _.template(templateString [, data] [, settings]) (can be switched out)

**Sandbox**

* `facade.start(channel, options)`
* `facade.stop(channel, el)`
* `facade.emit(channel)`
* `facade.on(subscriber, channel, callback)`
* `facade.dom.find(selector, context)`
* `facade.events.listen(context,events,selector,callback)`
* `facade.events.bindAll()`
* `facade.util.each(..)`
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
* `facade.widgets.start(channel, options)`
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

also, in order for the [grunt-jasmine-task](https://github.com/creynders/grunt-jasmine-task) to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed.

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. The easiest way to do so is using [Homebrew](https://github.com/mxcl/homebrew):

```shell
brew update
brew install phantomjs
```

In case you can't or don't want to use [Homebrew](https://github.com/mxcl/homebrew) you can get it on the PhantomJS [download page](http://phantomjs.org/download.html).

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it. Try running `phantomjs` in your Terminal to see if it already is.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

Now you've set up everything to start building Aura, to do so, just run

```shell
grunt build
```
somewhere in the project directory.

###Frequently Asked Questions

**Q: Can you describe Aura’s architectural philosophy?**

Aura’s design philosophy is predicated on the separation of components of js applications into separate pieces called modules. Initialization of modules can be controlled through a central interface. Communication between module is triggered through publishing and subscribing to interesting events.

An example: A module for a calendar would be interested that there is a new entry on a to do list. However, by themselves, a calendar or a task list could work alone. Since it is a matter of simply sending signals, a module could be stopped at run time without breaking the application, they were never required dependencies of each other, instead they shared commonality of dealing with the same type of data (schedule information) and purpose (this todo list is meant to synchronize with a calendar). Indeed, a second to do list could be instantiated that doesn’t talk to the calendar.

Aura’s sandbox should be used where it’s going to offer real benefits to your code architecture. It has a lot more than just that though - as a widget-based library, we also provide utilities for helping you with cross-module and cross-component communication, managing layouts (widgets), permissions and more.

**Q: Is the Aura architecture restricted to working with Backbone.js? What if I wanted to use it with a different framework?**

As of Aura 0.8.1 (edge) we have separated out the architecture part of the project from the Backbone.js layer. What this means is that if you’re a Backbone.js developer, you can simply use the Backbone.js extension provided in the repo to get everything that Backbone-Aura provided, however, if you would like to use Aura on it’s own you can now easily achieve this too. Our architecture should work well with most frameworks.

**Q: If I don’t use Aura on my complex Backbone.js application, what am I missing out on? Can’t I just use Backbone.Marionette or Chaplin?**

Backbone.Marionette provides a set of prefabricated Backbone.js views and collections with support for handling garbage collection and eliminating zombie views caused by undeleted references. Aura at the core level would not be 1.) biased toward backbone.js as a framework or 2.) specifics to handling views.

Marionette, however, is comprised of components which are reusable in independently.

**Q: How do you share a collection using Aura? e.g If I have a collection using many widgets, how do I correctly share this collection?**

This can be achieved by calling .emit() from the sandbox with some extra data e.g

```javascript
// task list
sandbox.emit('task', 'detail', id);

// task detail
sandbox.on('task', 'detail', function (caller, id) {
  // Do things with id
});
```

If you check out the console when you run Aura you will see a bunch of messages like "Todos-bootstrap message from from: controls". Each of those messages are being published from one widget and subscribed by another widget. You just have to add the additional data to the call. 

**Q: There are multiple models I would like to use that I’m placing in the sandbox. I would like to display paginated lists of my models using [Backbone.Paginator](https://github.com/addyosmani/backbone.paginator).**

You could opt to structure your widgets as follows, assuming we have a model for users and a model for projects:

```
~apps/foo/app.js
~widgets/paginatedUserList/
    models/
                (none - stored in the facade)
    collections/ 
                paginated-users.js
    views/
                user-item.js
                user-list.js
    templates/
                user-item.html
                user-list.html

~widgets/paginatedProjectList/
    models/
                (none - stored in the facade)
    collections/ 
                paginated-projects.js
    views/
                project-item.js
                project-list.js
    templates/
                project-item.html
                project-list.html
```


And then from the core, pass the following configurations:

```javascript
 core.start([{
    channel: 'paginatedProjectList',
    options: {
        element: '#project-list'
    }
  }, {
    channel: 'paginatedUserList',
    options: {
        element: '#user-list'
    }
  }]);
```

You may also wonder what happens if there are two project lists, one for your own projects, and one for a favorite friend? Let's say they're in a script tag:

```javascript
var projectListIds={
  myID:123,
  friendID:456
}
```

It seems like apps/foo/app.js would then contain:

```javascript
 core.start([{
    channel: 'paginatedProjectList',
    options: {
        element: '#project-list1'
    }
  }, {
    channel: 'paginatedProjectList',
    options: {
        element: '#project-list2'
    }
  }, {
    channel: 'paginatedUserList',
    options: {
        element: '#user-list'
    }
  }]);
```

You might wonder:

What needs to happen when loading the same widget multiple times in an app?
At what point in the widget initialization configuration should occur
How specific widgets should be.

We would recommend:

Creating a generic paginatedList component (maybe in a /components directory?)
Creating the paginatedProjectList and paginatedUserList widgets and have them instantiate the paginatedList with configuration options

It's a little more code, but much more reusable.


**Q: Is the Aura Abstraction of Vendor JS Libraries Overkill?**

This is a good question. When you first start using Aura, it’s easy to fall into the mindset of thinking that the abstractions within the architecture are too intense. Perhaps the most important tip benefiting from what Aura has to offer is understanding that each part of it is entirely flexible. 

Should you wish to abstract away a library (a DOM library, such as jQuery is a good example) you can easily do this and it makes sense. It’s easier to define what specific parts of a library like that you’re likely to need and thus simpler to define an abstract API that supports swapping it out for say, a querySelector based implementation or Zepto should the need arise. We make that very easy.

There are other situations where it’s important to review what you’re trying to achieve. 

Imagine you are a Backbone.js developer wishing to use an Aura sandbox. You may wish for your collections to do some non-trivial filtering. If you had Underscore.js in them directly, you could easily chain a few methods but when your collections don’t know about Underscore (abstracted away), you instead need to achieve this using the sandbox (e.g sandbox.util). This is a case of where its important to make a sanity call on there being too much abstraction. 

When trying to make a decision about whether or not to abstract a library, keep in mind how much of it you’re practically going to use. If you’re going to use 100% of its features (unlikely), this would involve writing a more detailed abstraction API and we wouldn’t recommend this as the investment to maintain would be too great. Only abstract when the resulting API is easy to read, easy to use and feasible to maintain.


### Why A Developer Preview?

Aura is currently missing two important items needed to help us get out a stable release. These are good unit tests and stronger documentation. When the project has these and we've confirmed everything works as expected, we'll announce it for others to check out. The developer preview is our way of letting developers play with some new toys early on and get community feedback on whether the project is useful or not.

At minimum it offers a reference application for some of the ideas Nicholas and Addy have spoken and written about in the past. We welcome your thoughts and any feedback on the project. Thanks!

### Team

* [Addy Osmani](http://github.com/addyosmani)
* [Gerson Goulart](http://github.com/gersongoulart)
* [Tony Narlock](http://github.com/tony)
* [Dustin Boston](http://github.com/dustinboston)
* [Stephane Bellity](https://github.com/sbellity)
* [Romain Dardour](https://github.com/unity)
* [Sindre Sorhus](http://github.com/sindresorhus)
* [Peter Rudolfsen](http://github.com/rudolfrck)
* [Robert Djurasaj](http://github.com/robertd)
* [Joel Hooks](http://github.com/joelhooks)
* [Dan Lynch](http://github.com/pyramation)

### License

Licensed under the [MIT](https://github.com/addyosmani/aura/tree/master/LICENSE.md) license.
