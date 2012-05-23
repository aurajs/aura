##Backbone-Aura 0.8 Preview

Backbone Aura is a decoupled, event-driven architecture on top of Backbone.js for developing scalable applications. It provides complete control of a widget's lifecycle, allowing developers to dynamically start, stop, reload and clean-up modules as needed.

Aura contains a multi-tiered architecture, consistening of:

* An application core (mediator) for utilities and aliases to parts of a library that might be required
* A sandbox (facade) that both protects the application from allowing unsafe widgets from loading but also provides the simplest API possible to interact with the mediator layer
* AMD modules which with RequireJS 2.0 can be easily loaded, unloaded and used to build decoupled modules as needed

The new primary version of Aura is written by Addy Osmani and Dustin Boston, with our older alternative takes on these ideas being available in another directory of the same repo (for reference).