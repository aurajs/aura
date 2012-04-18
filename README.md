##Backbone-Aura

Backbone Aura is a decoupled, event-driven Backbone architecture for developing applications. It uses concepts discussed in my talks on [large-scale JavaScript application development](http://addyosmani.com/largescalejavascript). Specifically, ideas regarding mediator and facade pattern integration with Backbone are shown.

A number of different implementations of this idea are demonstrated in this repository. At present, new-version and module-activator-version are examples recommended to review. aura-core and aura-example are currently still in development in collaboration with Dustin Boston.

### Introduction

The implementation includes:

<ul>
<li>The Mediator pattern for centralized Pub/Sub</li>
<li>Facade pattern for security/permissions</li>
<li>RequireJS + AMD modules for organization and modular development</li>
<li>Backbone.js for MV* structure</li>
<li>jQuery</li>
<li>Templating via Underscore</li>
</ul>

### Summary

The application is broken down into AMD modules that contain distinct pieces of functionality (eg. views, models, collections, app-level modules). The views publish events of interest to the rest of the application and modules can then subscribe to these event notifications. 

All <code>subscriptions</code> go through a facade (or sandbox). What this does is check against the subscriber name and the 'channel/notifcation' it's attempting to subscribe to - if a subscriber *doesn't* have permissions to do this (something established through permissions.js), the subscription isn't allowed through. The rest of the application is however able to continue functioning. 

For demonstration, see the permissions manager (permissions.js). By changing say, permissions -> renderDone -> todoCounter to be false, you can completely disable that component from displaying counts (because it isn't allowed to subscribe to that event). The rest of the Todo app can still however be used without issue. Nifty, eh?

### Directories

The most important part of this application can be found in the <code>js/aura</code> directory (mediator.js for centralized pub/sub and facade.js + permissions.js for permissions for sandboxing and security). The main directory contains the usual models/views/collections etc. whilst the modules.js file hosts the subscriber 'modules' consuming events broadcast (published) from the views.

I strongly recommend using the updated <code>new-version</code> of the code. If however you opt for the <code>module-activator-version</code>, note that <code>app/scripts/util</code> contains a set of helpers for module loading and execution. Whilst that version of the app use theses helpers, they are by no means absolutely required for successfully creating Backbone applications using AMD modules. 

For more information on writing applications using AMD modules see my [guide](http://addyosmani.com/writing-modular-js).

The older module-activator-version is based on [portions](https://github.com/addyosmani/Backbone_RequireJS) by Ryan Rauh


