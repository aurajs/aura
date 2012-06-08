##Backbone-Aura 0.8 Preview

Backbone Aura is a decoupled, event-driven architecture on top of Backbone.js for developing widget-based applications. It provides complete control of a widget's lifecycle, allowing developers to dynamically start, stop, reload and clean-up modules as needed.

Aura contains a multi-tiered architecture, consistening of:

* An Application Core (using the mediator pattern) for utilities and aliases to parts of a library that might be required. As you communicate through Aura instead of directly with libraries, decisions about which ones to use can be switched out behind the scenes. 
* A Sandbox (facade pattern) that both protects the application from allowing unsafe widgets from loading but also provides the simplest API possible to interact with the mediator layer. Permissions cab be expanded as much as needed.
* AMD modules which with RequireJS 2.0 can be easily loaded, unloaded and used to build decoupled widgets. I've expanded on top of RequireJS's new module unloading capabilities to work around the limitation of not being able to resolve a module's dependencies. This allows you to easily undefine all the modules for a widget (removing them from Require's caches, lowering memory and cleaning up the DOM)

 Backbone Aura is written by Addy Osmani and Dustin Boston, with our older alternative takes on these ideas being available in another directory of the same repo (for reference). 


## Directory Structure

*-- js/aura*

Contains the core implementation of the Application Core (mediator.js), Sandbox (facade.js) and base for widget Permissions validation (permissions.js). 

*-- js/ext*

Extensions to the Application Core, Sandbox and Permissions can be found here. These contain example specific extensions such as support for Backbone.js and bootstrap/load permissions for the example's widgets.

*-- js/widgets*

The three sample widgets for the example: Calendar, Todos and Controls. Both the Calendar and Todos persist using localStorage whilst the Controls widget is there to just demonstrate how one could control the start and stop of widgets through the UI. Normally this process would be handled by modules.

*app.js*

RequireJS 2.0 configuration, including `shim` config to allow the loading of non AMD-patched versions of libraries such as Underscore.js and Backbone.js. This is the initial point of starting up the widgets for an application. 

