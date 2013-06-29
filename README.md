# Aura 0.9pre 
[![Build Status](https://travis-ci.org/aurajs/aura.png?branch=master)](https://travis-ci.org/aurajs/aura)

Aura is an **event-driven architecture for wrapping your code into reusable widgets and extensions that can easily communicate with each other.**
 
We work great with **existing** frameworks like [Backbone.js](http://backbonejs.org) or [Ember](http://emberjs.com), but are framework-agnostic, adapting many best-practice patterns for developing maintainable applications.

<img src="assets/images/notmvc.jpg"/>

Aura has first-class support for modern tools like [Bower](http://bower.io)], [Grunt](http://gruntjs.com) and [Yeoman](http://yeoman.io) and uses libraries like [RequireJS](http://requirejs.org/) under the covers (for now). As solutions like ES6 modules and [Polymer](http://www.polymer-project.org) become stable and usable, the project will move towards using them.

## Everything is a widget

A widget is something **[atomic](http://juristr.com/blog/2013/04/modularity-in-javascript-frameworks/)** with a clear responsibility. A mini-app basically that can be instantiated (possibly multiple times) on an arbitrary part of your application. You might not be accustomed to thinking like this, preferring to build a highly coupled app. That might work just fine initially, but once it gets more complex you can run into trouble. Therefore, next time when you start building something bigger, stop for a moment and try to identify possible widgets.

Consider for example GitHub’s site:

<img src="assets/images/github.jpg"/>

Separating your application into smaller parts is essential for keeping your architecture clean, reusable and mainly maintainable. The principle is a known concept in computer science: “divide and conquer”. Divide everything up into smaller parts which have lower complexity, are easier to test and cause fewer headaches. Then compose them together to form your larger application.

## But Wait: My Widgets Have to Communicate!

Modules (or widgets) within your application need to communicate with each other. Such communication creates dependencies as widget An eeds to have a reference to widget B if it needs to invoke some operation on it, right? Well, not necessarily, as that would again couple those widgets together and you couldn’t exchange widget B arbitrarily without having to also change widget A.

Therefore, a common practice for creating a modular architecture is to decouple communication among components through event broadcasting mechanisms. Aura comes with global and widget-level messaging patterns, making this a breeze.

<img src="assets/images/multi.jpg"/>

## A Quick Example

### How does it work ?

Widgets are completely decoupled, they only can talk to each other via events. You can't have a handle on them from the outside, and themselves are just aware of what you explicitely make available throught their sandboxes`.

To build your app, you can assemble widgets via AuraJS's HTML API, by using the data-aura-widget` attribute.

Let's take an example. Let's say that we want to build a Github Issues app. We need to be able to :

* Display lists of issues from specific repos
* Filter those issues


Now let's make some widgets, but first we need a way to talk to [Github's API](http://developer.github.com/v3/issues/).

Here is a simple [AuraJS extension](https://github.com/aurajs/aura/blob/master/notes/extensions.md) that does just that :

**extensions/aura-github.js**

```js
    define({
      initialize: function (app) {
        app.sandbox.github = function (path, verb, data) {
          var dfd = $.Deferred();
          var token = app.config.github.token;
          verb = verb || 'get';
          if (data &amp;&amp; verb != 'get') {
            data = JSON.stringify(data);
          }
          $.ajax({
            type: verb,
            url: 'https://api.github.com/' + path,
            data: data,
            headers: {
              "Authorization": "token " + token
            },
            success: dfd.resolve,
            error: dfd.reject
          });
          return dfd;
        };
      }
    });
```

This extension exposes in all our widgets a way to talk to Github's API via the this.sandbox.github` method.

To use it in your aura app :

**app.js**


```js
    var app = new Aura({
      github: { token: 'current-user-token-here' }
    });
    app.use('extensions/aura-github');
    app.start({ widgets: 'body' });
```

And now, let's write the issues` widget :

**widgets/issues/main.js**


```js
    define(['underscore', 'text!./issues.html'], function(_, tpl) {

      // Allow template to be overriden locally 
      // via a text/template script tag
      var template, customTemplate = $('script['data-aura-template="github/issues"]');
      if (customTemplate.length &gt; 0) {
        template = _.template(customTemplate.html());
      } else {
        template = _.template(tpl);
      }

      return {
        initialize: function() {
          _.bindAll(this);
          this.repo   = this.options.repo;
          this.filter = this.options.filter || {};
          this.sandbox.on('issues.filter', this.fetch, this);
          this.fetch();
        },
        fetch: function(filter) {
          this.filter = _.extend(this.filter, filter || {});
          var path = 'repos/' + this.repo + '/issues';
          return this.sandbox.github(path, 'get', this.filter).then(this.render);
        },
        render: function(issues) {
          this.html(template({
            issues: issues,
            filter: this.filter,
            repo: this.repo
          }));
        }
      };
    });
```

Now we can place this widget everywhere in our app by using Aura's HTML API based on data-attributes.


```html
    &lt;div data-aura-widget="issues" data-aura-repo="aurajs/aura"&gt;&lt;/div&gt;
```

You can even have multiple instances of this widget in you page :


```html
    &lt;div class='row'&gt;
      &lt;div class='span4' data-aura-widget="issues" data-aura-repo="aurajs/aura"&gt;&lt;/div&gt;
      &lt;div class='span4' data-aura-widget="issues" data-aura-repo="emberjs/ember.js"&gt;&lt;/div&gt;
      &lt;div class='span4' data-aura-widget="issues" data-aura-repo="documentcloud/backbone"&gt;&lt;/div&gt;
    &lt;/div&gt;
```

Any other widget can now emit issues.filter`  events that these widgets will respond to.
For example in another widget that will allow the user to filter the issues lists, we can have :

```js
    this.sandbox.emit('issues.filter', { state: 'closed' });
```

You can find a [Github client demo app based on AuraJS + a bunch of Github widgets here](http://github.com/sbellity/aura-github)

## Why Aura?

Web apps are all about the end user experience (UI, DOM elements). The web development ecosystem is all about much more low level stuff. We need a way to package higher level abstractions and make them truly reusable, and that's what Aura is all about.

Need some more reasons to use Aura?:

* It's basically **glue** for your application widgets, making it trivial to tie together a number of independently created widgets into a fully functional application.
* A complete event-bus supporting **application-level and widget-level communication** mean you have control over what is getting triggered in your app
* Specify an API end-point for widgets easily and just **use data-attributes to include any widget** or widgets. Minimal JavaScript for more capabilities.
* **Abstract away utility libraries** you are using (templating, DOM manipulation) so that you can swap them out for alternatives at any time without a great deal of effort
* Hit the ground running quickly widgets into **reusable modules using AMD**.
* Bower is a first-class citizen in Aura, making it easier to **manage your application dependencies**
* The web platform is moving towards using scoped styles and shadow DOM for keeping parts of your page safe from third-party content that might affect it. Aura does the same for communications by introducing per-widget **sandboxes** for your events
* Tooling for **scaffolding** out new widgets without having to write as much boilerplate
* Can be used with your MVC framework of choice - we're just there as a helper.
* First-class support for the Hull.io platform. If you don't want to create a widget yourself, you can easily use them as a widget-source and create apps in less time.
* Extensible via the extensions system, which make a good basis for a rich ecosystem around the project.


## Concepts

#### The `Aura` object

Your application will be an instance of the `Aura` object.

Its responsibilities are to load extensions when the app starts and clean them up when the app stops.

#### Extension

Extensions are loaded in your application when it starts. They allow you to add features to the application, and are available to the widgets through their `sandbox`.

#### Core

The `core` implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice. Aliases allow switching libraries with minimum impact on your application.

#### Sandbox

A `sandbox` is just a way to implement the [facade](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript) pattern on top of features provided by `core`. It lets you expose the parts of a JavaScript library that are safe to use instead of exposing the entire API. This is particularly useful when working in teams.

When your app starts, it will create an instance of `sandbox` in each of your widgets.

#### Widget

A widget represents a unit of a page. Each widget is independent.
This means that they know nothing about each other. To make them communicate, a [Publish/Subscribe (Mediator)](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript) pattern is used.


## Getting started

The simplest usable Aura app using a widget and extension can be found in our [boilerplate](https://github.com/aurajs/boilerplate) repo. We do however recommend reading the rest of the getting started guide below to get acquainted with the general workflow.

#### Requirements

1. [bower](http://twitter.github.com/bower/): run `npm install -g bower` if needed
2. [grunt-cli](https://github.com/gruntjs/grunt-cli): run `npm install -g grunt-cli` if needed

#### Building Aura.js

1. Run `npm install` to install build dependencies.
2. Run `bower install` to install lib dependencies.
3. Run `grunt build` and `aura.js` will be placed in `dist/`.

### Running Tests

#### Browser

Run `grunt`. Then visit `http://localhost:8899/spec/`.

#### CLI

Run `npm test`.

## Creating an Application

The first step in creating an Aura application is to make an instance of `Aura`.

```js
var app = new Aura();
```

Now that we have our `app`, we can start it.

```js
app.start({
  widget: 'body'
});
```

This starts the app by saying that it should search for widgets anywhere in the `body` of your HTML document.

## Creating a Widget

By default widgets are retrieved from a directory called `widgets/` that must be at the same level as your HTML document.

Let's say we want to create an "hello" widget. To do that we need to create a `widgets/hello/` directory

This directory must contain:

- A `main.js` file. It will bootstrap and describe the widget. It is mandatory, no matter how small it can be.
- All the other files that your widget needs (models, templates, …).

For our "hello" widget the `main.js` will be:

```js
    define({
      initialize: function () {
        this.$el.html('<h1>Hello Aura</h1>');
      }
    });
```

## Declaring a Widget

Add the following code to your HTML document.

```html
    <div data-aura-widget="hello"></div>
```

Aura will call the `initialize` method that we have defined in `widgets/hello/main.js`.

## Creating an extension

Imagine that we need an helper to reverse a string. In order to accomplish that we'll need to create an extension.

```js
define('extensions/reverse', {
  initialize: function (app) {
    app.core.util.reverse = function (string) {
      return string.split('').reverse().join('');
    };
  }
});
```

## Event notifications

The Aura [Mediator](https://github.com/aurajs/aura/blob/master/lib/ext/mediator.js) allows widgets to communicate with each other by subscribing, unsubscribing and emitting sandboxed event notifications. The signatures for these three methods are:

* `sandbox.on(name, listener, context)`
* `sandbox.off(name, listener)`
* `sandbox.emit(data)`

Below we can see an example of a Backbone view using the Mediator to emit a notification when tasks have been cleared and subscribing to changes from `tasks.stats` in order to render when they are updated.

```js
define(['hbs!./stats'], function(template) {
  return {
    type: 'Backbone',
    events: {
      'click button': 'clearCompleted'
    },
    initialize: function() {
      this.render();
      this.sandbox.on('tasks.stats', _.bind(this.render, this));
    },
    render: function(stats) {
      this.html(template(stats || {}));
    },
    clearCompleted: function() {
      this.sandbox.emit('tasks.clear');
    }
  }
});
```

## Using extensions

To make our `reverse` helper available in our app, run the following code:

```js
app.use('extensions/reverse');
```

This will call the `initialize` function of our `reverse` extension.

Calling `use` when your `app` is already started will throw an error.

## Debugging

To make `app.logger` available, pass `{debug: true}` into Aura constructor:

```js
var app = new Aura({debug: true});
```

Logger usage:

```js
// You can use logger from widgets or extensions
var logger = sandbox.logger;

logger.log('Hey');
logger.warn('Hey');
logger.error('Hey');
```

If you want to enable event logging, do this:

```js
  var app = new Aura({debug: true, logEvents: true});
```

Also, when parameter `debug` is true, you can declare following function for any debug purposes:

```js
// Function will be called for all Aura apps in your project
window.attachDebugger = function (app) {
  // Do cool stuff with app object
  console.log(app);

  // Maybe you want to have access to Aura app via developer console?
  window.aura = app;
};
```


# Resources

## Yeoman generator

An Aura scaffolding generator (for Yeoman) is also available at [Aura generator](https://github.com/dotCypress/generator-aura).

### Usage

```bash
  # First make a new directory, and `cd` into it:
  mkdir my-awesome-project && cd $_

  # Then install `generator-aura`:
  npm install -g generator-aura

  # Run `yo aura`, optionally passing an app name:
  yo aura [app-name]

  # Finally, install npm and bower dependencies:
  npm install && bower install --dev
```

### Generators

Available generators:

* [aura:widget](#widget)
* [aura:extension](#extension)
* [aura:styles](#styles)

### Widget
Generates a widget in `app/widgets`.

Example:

```bash
yo aura:widget sample
```

Produces `app/widgets/sample/main.js`

### Extension
Generates a extension in `app/extensions`.

Example:
```bash
yo aura:extension storage
```

Produces `app/extensions/storage.js`

### Styles
Generates cool styles.

Example:
```bash
yo aura:styles
```

##### Supported types:

* Default (normalize.css)
* Twitter Bootstrap
* Twitter Bootstrap for Compass
* Zurb Foundation


# Examples

Want to look at some sample apps built with Aura? Check out:

##GitHub client

[Repo](https://github.com/sbellity/aura-github)

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app2.png"/>

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app3.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app4.png"/>

## GitHub Mobile client

[Repo](https://github.com/hull/Github-Mobile/tree/with-hull)


##Hullagram

[Repo](https://github.com/hull/hullagram) 

An Instagram clone built with Aura and [Hull.io](http://hull.io).

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-1.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-2.png"/>

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-3.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-4.png"/>


##Aura TodoMVC

[Repo](https://github.com/sbellity/aura-todos/)

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/todomvc.png"/>

Also implemented in an [alternative](https://github.com/alexanderbeletsky/todomvc-aura) way.


##A Twitter-like "Open Source" page using Aura. 

[Tutorial](http://blog.hull.io/post/46504817377/how-to-build-your-own-twitter-like-open-source-page)

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/opensource-page.png" width="600px"/>


##Writing simple GitHub widgets

[Repo](https://gist.github.com/sbellity/b44364f29fd89679ca39)

### Aura Development docs

* [Notes](https://github.com/aurajs/aura/tree/master/notes)

# FAQs

* [Where does Aura fit in the MVC workflow?](https://github.com/aurajs/aura/issues/223)
* [How do you initialize a widget with with data objects?](https://github.com/aurajs/aura/issues/222)
* [Using multiple views and models in a widget](https://github.com/aurajs/aura/issues/224)
* [Sharing collections of data](https://github.com/karlwestin/aura-example)


# Why do developers use us?

* "The architecture and the fact that Aura Widgets are completely decoupled, will allow us to build an ecosystem of widgets that people can reuse internally or share with others."
* "With WidgetSources and Require, we can load only the widgets that are needed by the app... at runtime."
* "No JS is required to wire everything up, just include widgets with data-attributes in their markup"
* "Mediation, same thing here it's a prerequisite to make everything decoupled... but in addition, it allows us to write much less code..."
* "Template overrides FTW"

# Contribute

See the [contributing docs](https://github.com/aurajs/aura/blob/master/contributing.md)
