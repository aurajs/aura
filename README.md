# Aura

Aura is a decoupled, event-driven architecture for developing widget-based applications. It takes advantage of patterns and best practices for developing maintainable applications and gives you greater control over widget-based development. Aura gives you complete control of a widget's lifecycle, allowing developers to dynamically start, stop, reload and clean-up parts of their application as needed.

## Concepts

### The `Aura` object

Your application will be an instance of the `Aura` object.

Its responsibilities are to load extensions when the app starts and clean them up when the app stops.

### Extension

Extensions are loaded in your application when it starts. They allow you to add features to the application, and are available to the widgets through their `sandbox`.

### Core

The `core` implements aliases for DOM manipulation, templating and other lower-level utilities that pipe back to a library of choice. Aliases allow to switch libraries with minimum impact on your application.

### Sandbox

A `sandbox` is just way to implement the [facade](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript) pattern on top of features provided by `core`. It lets you to expose the parts of a JavaScript library that are safe to use instead of exposing the entire API. This is particularly useful when working in teams.

When your app starts, it will create an instance of `sandbox` in each of your widgets.

### Widget

A widget represents an unit of a page. Each widget is independant.
This means that they know nothing about each other. To make them communicate, a [Publish/Subscribe (Mediator)](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript) pattern is used.


## Getting started

### Building Aura.js

1. Run `npm install` and `bower install` to install Aura dependencies.
2. Run `grunt build`. `aura.js` will be placed in `dist/`.

### How to run tests

#### Browser

Start the developement server. Run `grunt`. Then visit `http://localhost:8899/spec/`.

#### CLI

Run `grunt mocha`.

### Creating an Application

The first step in creating an Aura application is to make an instance of `Aura`.

    var app = new Aura();

Now that we have your `app`, we can start it.

	app.start({
	  widget: "body"
	});

This starts the app by saying that it should search for widgets anywhere in the `body` of your HTML document.

### Creating a Widget

By default widgets are retreived from a directory called `widgets/` that must be at the same level as your HTML document.

Let's say we want to create an "hello" widget. To do that we need to create a `widgets/hello/` directory

This directory must contain:

- A `main.js` file. It will bootstrap and describe the widget. It is mandatory, no matter how small it can be.
- All the other files that your widget needs (models, templates, …).

For our "hello" widget the `main.js` will be:

    define({
      initialize: function() {
        this.$el.html("<h1>Hello Aura</h1>");
      }
    });

### Declaring a Widget

Add the following code to your HTML document.

    <div data-aura-widget="hello"></div>

Aura will call the `initialize` method that we have defined in `widgets/hello/main.js`.

### Creating extension

Imagine that we need an helper to reverse string. To do that we need to create an extension.

    define("extentions/reverse", {
      init: function(app) {
        app.core.util.reverse = function(string) {
          return string.split("").reverse().join("");
        };
      }
    });

### Using extension

To make our `reserve` helper available in our app, run the following code:

    app.use("extentions/reverse");

This will call the `init` function of our reserve extension.

Calling `use` when your `app` is allready started will throw an error.

