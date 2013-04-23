# Aura 0.9pre [![Build Status](https://travis-ci.org/aurajs/aura.png?branch=master)](https://travis-ci.org/aurajs/aura)

Aura is an event-driven architecture for developing widget-based applications that scale. It is framework-agnostic, adapts many best-practice patterns for developing maintainable apps and has first-class support for modern tools like [Bower](http://bower.io), [Grunt](http://gruntjs.com) and [Yeoman](http://yeoman.io).

Aura has been used to develop applications like [MIT's Reap](http://www.bobholt.me/2012/09/how-it-was-built-mit-reap/) and is currently under active development.

Want to look at some sample apps built with Aura? Check out the [GitHub client](https://github.com/sbellity/aura-github), an Aura [Todo](https://github.com/sbellity/aura-todos/) app implemented [two](https://github.com/alexanderbeletsky/todomvc-aura) ways and [Hullagram](https://github.com/hull/hullagram) - an Instagram clone built with Aura and [Hull.io](http://hull.io).

<img src="https://raw.github.com/hull/aura-identity/master/logo/export/halo.png" width="300px"/>

## Why Aura?

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

### The `Aura` object

Your application will be an instance of the `Aura` object.

Its responsibilities are to load extensions when the app starts and clean them up when the app stops.

### Extension

Extensions are loaded in your application when it starts. They allow you to add features to the application, and are available to the widgets through their `sandbox`.

### Core

The `core` implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice. Aliases allow switching libraries with minimum impact on your application.

### Sandbox

A `sandbox` is just a way to implement the [facade](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript) pattern on top of features provided by `core`. It lets you expose the parts of a JavaScript library that are safe to use instead of exposing the entire API. This is particularly useful when working in teams.

When your app starts, it will create an instance of `sandbox` in each of your widgets.

### Widget

A widget represents a unit of a page. Each widget is independent.
This means that they know nothing about each other. To make them communicate, a [Publish/Subscribe (Mediator)](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript) pattern is used.


## Getting started

The simplest usable Aura app using a widget and extension can be found in our [boilerplate](https://github.com/aurajs/boilerplate) repo. We do however recommend reading the rest of the getting started guide below to get acquainted with the general workflow.

### Requirements

1. [bower](http://twitter.github.com/bower/): run `npm install -g bower` if needed
2. [grunt-cli](https://github.com/gruntjs/grunt-cli): run `npm install -g grunt-cli` if needed

### Building Aura.js

1. Run `npm install` to install build dependencies.
2. Run `bower install` to install lib dependencies.
3. Run `grunt build` and `aura.js` will be placed in `dist/`.

### How to run tests

#### Browser

Run `grunt`. Then visit `http://localhost:8899/spec/`.

#### CLI

Run `npm test`.

### Creating an Application

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

### Creating a Widget

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

### Declaring a Widget

Add the following code to your HTML document.

```html
<div data-aura-widget="hello"></div>
```

Aura will call the `initialize` method that we have defined in `widgets/hello/main.js`.

### Creating an extension

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

### Using extensions

To make our `reverse` helper available in our app, run the following code:

```js
app.use('extensions/reverse');
```

This will call the `initialize` function of our `reverse` extension.

Calling `use` when your `app` is already started will throw an error.

### Debugging

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


## Resources

### Yeoman generator

An Aura scaffolding generator (for Yeoman) is also available at [Aura generator](https://github.com/yeoman-aura/generator-aura).

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

#### Widget
Generates a widget in `app/widgets`.

Example:

```bash
yo aura:widget sample
```

Produces `app/widgets/sample/main.js`

#### Extension
Generates a extension in `app/extensions`.

Example:
```bash
yo aura:extension storage
```

Produces `app/extensions/storage.js`

#### Styles
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


### Aura Development docs

* [Notes](https://github.com/aurajs/aura/tree/master/notes)

## Contribute

See the [contributing docs](https://github.com/aurajs/aura/blob/master/contributing.md)

## Project status

Aura 0.8.x was well received by the developer community, but had regular requests for a few advanced capabilities. These included individual sandboxes, declarative widgets, support for Bower and a powerful Pub/Sub implementation amongst others.

To cater for this, Aura has been getting a heavy re-write over the past few months and we anticipate releasing a beta that can be tested in April, 2013. This will be followed by detailed documentation and new demo applications.

A version of Aura currently powers the [Hull.io](http://hull.io) widget platform and we are honored to have members of that team directly contributing to the next version of the project.
