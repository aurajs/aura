# Aura 0.9.1 
[![Build Status](https://travis-ci.org/aurajs/aura.png?branch=master)](https://travis-ci.org/aurajs/aura)

Aura is an event-driven architecture for developing scalable applications using reusable components. It works great with [Backbone.js](http://backbonejs.org), but is framework-agnostic, adapts many best-practice patterns for developing maintainable apps and has first-class support for modern tools like [Bower](http://bower.io), [Grunt](http://gruntjs.com) and [Yeoman](http://yeoman.io).

Aura has been used to develop applications like [MIT's Reap](http://www.bobholt.me/2012/09/how-it-was-built-mit-reap/) and is currently under active development.

## Why Aura?

We've seen a large shift in the JavaScript community for the past 3 years, with people starting to write web apps in a much more structured way. Yet, assembling the bits and pieces and actually starting to make apps is still a challenge. Another challenge is that most of the time you end up doing the same stuff all over again : you need a way to authenticate users, give them ways to communicate, exchange ideas, work or play together. You have to integrate with external services or APIs like Facebook or Twitter.

Web apps are all about the end user experience (UI, DOM elements). The web development ecosystem is all about much more low level stuff. We need a way to package higher level abstractions and make them truly reusable, and that's what Aura is all about.

Need some more reasons to use Aura?:

* It's basically **glue** for your application components, making it trivial to tie together a number of independently created components into a fully functional application.
* A complete event-bus supporting **application-level and component-level communication** mean you have control over what is getting triggered in your app
* Specify an API end-point for components easily and just **use data-attributes to include any component** or components. Minimal JavaScript for more capabilities.
* **Abstract away utility libraries** you are using (templating, DOM manipulation) so that you can swap them out for alternatives at any time without a great deal of effort
* Hit the ground running quickly components into **reusable modules using AMD**.
* Bower is a first-class citizen in Aura, making it easier to **manage your application dependencies**
* The web platform is moving towards using scoped styles and shadow DOM for keeping parts of your page safe from third-party content that might affect it. Aura does the same for communications by introducing per-component **sandboxes** for your events
* Tooling for **scaffolding** out new components without having to write as much boilerplate
* Can be used with your MVC framework of choice - we're just there as a helper.
* First-class support for the Hull.io platform. If you don't want to create a component yourself, you can easily use them as a components-source and create apps in less time.
* Extensible via the extensions system, which make a good basis for a rich ecosystem around the project.


## Concepts

#### The `Aura` object

Your application will be an instance of the `Aura` object.

Its responsibilities are to load extensions when the app starts and clean them up when the app stops.

#### Extension

Extensions are loaded in your application when it starts. They allow you to add features to the application, and are available to the components through their `sandbox`.

#### Core

The `core` implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice. Aliases allow switching libraries with minimum impact on your application.

#### Sandbox

A `sandbox` is just a way to implement the [facade](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript) pattern on top of features provided by `core`. It lets you expose the parts of a JavaScript library that are safe to use instead of exposing the entire API. This is particularly useful when working in teams.

When your app starts, it will create an instance of `sandbox` in each of your components.

#### Component

A component represents a unit of a page. Each component is independent.
This means that they know nothing about each other. To make them communicate, a [Publish/Subscribe (Mediator)](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript) pattern is used.


## Getting started

The simplest usable Aura app using a component and extension can be found in our [boilerplate](https://github.com/aurajs/boilerplate) repo. We do however recommend reading the rest of the getting started guide below to get acquainted with the general workflow.

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
  components: 'body'
});
```

This starts the app by saying that it should search for components anywhere in the `body` of your HTML document.

## Creating a Component

By default components are retrieved from a directory called `components/` that must be at the same level as your HTML document.

Let's say we want to create an "hello" component. To do that we need to create a `components/hello/` directory

This directory must contain:

- A `main.js` file. It will bootstrap and describe the component. It is mandatory, no matter how small it can be.
- All the other files that your component needs (models, templates, …).

For our "hello" component the `main.js` will be:

```js
define({
  initialize: function () {
    this.$el.html('<h1>Hello Aura</h1>');
  }
});
```

## Declaring a Component

Add the following code to your HTML document.

```html
<div data-aura-component="hello"></div>
```

Aura will call the `initialize` method that we have defined in `components/hello/main.js`.

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


## Using extensions

Extensions can then be loaded by your app by referencing them with their module name.

To make our `reverse` helper available in our app, run the following code:

This will call the `initialize` function of our `reverse` extension.

```js
var app = Aura();
app.use('extensions/reverse');
app.start({ widgets: 'body' });
```

Calling `use` when your `app` is already started will throw an error.

## Emitting and listening for event notifications

The Aura [Mediator](https://github.com/aurajs/aura/blob/master/lib/ext/mediator.js) allows components to communicate with each other by subscribing, unsubscribing and emitting sandboxed event notifications. The signatures for these three methods are:

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

## Debugging

To enable debug extension and logging pass `{debug: {enable: true}}` into Aura constructor:

```js
var app = new Aura({debug: {
  enable: true
});
```
Logger usage:

```js
// You can use logger from components or extensions
var logger = sandbox.logger;

logger.log('Hey');
logger.warn('Hey');
logger.error('Hey');

//Or directly from Aura app

var logger = app.logger;
```
Below we can see an example how to enable logging in specific ext/components.
By default all loggers are enabled.

```js
var app = new Aura({debug: {
  enable: true,
  components: 'aura:mediator login signup info'
});
```

Built-in components:

* aura:mediator - event logging.

Also, when `debug mode` is enabled, you can declare following function for any debug purposes:

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

## Usage

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

## Generators

Available generators:

* [aura:component](#component)
* [aura:extension](#extension)
* [aura:styles](#styles)

### Component
Generates a component in `app/components`.

Example:

```bash
yo aura:component sample
```

Produces `app/components/sample/main.js`

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

###The [GitHub client](https://github.com/sbellity/aura-github)

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app.png"  width="600px"/>


<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app2.png"  width="600px"/>


<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app3.png"  width="600px"/>


<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/github-app4.png"  width="600px"/>


###The [GitHub Mobile client](https://github.com/hull/Github-Mobile/tree/with-hull)


###[Hullagram](https://github.com/hull/hullagram) - an Instagram clone built with Aura and [Hull.io](http://hull.io).


<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-1.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-2.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-3.png"/>
<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/hullagram-4.png"/>


###An Aura [TodoMVC](https://github.com/sbellity/aura-todos/) app implemented [two](https://github.com/alexanderbeletsky/todomvc-aura) ways 

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/todomvc.png"/>


### [How to build your own Twitter-like "Open Source" page](http://blog.hull.io/post/46504817377/how-to-build-your-own-twitter-like-open-source-page) using Aura. 

<img src="https://raw.github.com/aurajs/aura-identity/master/screenshots/medium/opensource-page.png" width="600px"/>


###Writing a simple [GitHub component](https://gist.github.com/sbellity/b44364f29fd89679ca39) using Aura.

### Aura Development docs

* [Notes](https://github.com/aurajs/aura/tree/master/notes)

# FAQs

* [Where does Aura fit in the MVC workflow?](https://github.com/aurajs/aura/issues/223)
* [How do you initialize a component with with data objects?](https://github.com/aurajs/aura/issues/222)
* [Using multiple views and models in a component](https://github.com/aurajs/aura/issues/224)
* [Sharing collections of data](https://github.com/karlwestin/aura-example)


# Why do developers use us?

* "The architecture and the fact that Aura Components are completely decoupled, will allow us to build an ecosystem of components that people can reuse internally or share with others."
* "With ComponentSources and Require, we can load only the components that are needed by the app... at runtime."
* "No JS is required to wire everything up, just include components with data-attributes in their markup"
* "Mediation, same thing here it's a prerequisite to make everything decoupled... but in addition, it allows us to write much less code..."
* "Template overrides FTW"

# Contribute

See the [contributing docs](https://github.com/aurajs/aura/blob/master/contributing.md)

# Project status

Aura 0.8.x was well received by the developer community, but had regular requests for a few advanced capabilities. These included individual sandboxes, declarative components, support for Bower and a powerful Pub/Sub implementation amongst others.

To cater for this, Aura has been getting a heavy re-write over the past few months and we anticipate releasing a beta that can be tested in April, 2013. This will be followed by detailed documentation and new demo applications.

A version of Aura currently powers the [Hull.io](http://hull.io) components platform and we are honored to have members of that team directly contributing to the next version of the project.
