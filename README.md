##Backbone-Aura

This repo demonstrates an (event-driven) Todo application using 2/3 of the concepts I discuss in my talks on large-scale JavaScript application development. This is the first time I've attempted to apply some of these concepts to Backbone.js, so the implementation may still require a few tweaks (and most likely does). That said, it uses:

<ul>
<li>The mediator pattern for centralized Pub/Sub</li>
<li>Facade pattern for security/permissions</li>
<li>RequireJS</li>
<li>AMD modules (great for modular development)</li>
<li>Backbone.js & Underscore.js for MVC structure</li>
<li>jQuery 1.7</li>
<li>Templating via jQuery.tmpl (although this can be switched out for anything)</li>
</ul>

### Summary

The application is broken down into AMD modules that contain distinct pieces of functionality (eg. views, models, collections, app-level modules). The views publish events of interest to the rest of the application and modules can then subscribe to these event notifications. 

All <code>subscriptions</code> go through a facade (or sandbox). What this does is check against the subscriber name and the 'channel/notifcation' it's attempting to subscribe to - if a subscriber *doesn't* have permissions to do this (something established through permissions.js), the subscription isn't allowed through. The rest of the application is however able to continue functioning. 

For demonstration, see the permissions manager (permissions.js). By changing say, permissions -> renderDone -> todoCounter to be false, you can completely disable that component from displaying counts (because it isn't allowed to subscribe to that event). The rest of the Todo app can still however be used without issue. Nifty, eh?

### Folders

The most important part of this application can be found in the <code>app/scripts/backbone/todo</code> directory. This contains the AMD formatted models, views and collections needed. It also contains the mediator (mediator.js) providing pub/sub and a modules.js file containing subscribers consuming events broadcast (published) from the views.

<code>app/scripts/util</code> contains a set of helpers for module loading and execution. Note that whilst this demo does use these helpers, this *isn't* absolutely required for successfully creating Backbone applications using AMD modules. For an alternative approach to this, see [1].

For more information on writing applications using AMD modules see [2]

Based on portions by Ryan Rauh [3]


###References

<ul>
<li>[1] http://backbonetutorials.com/organizing-backbone-using-modules</li>
<li>[2] http://addyosmani.com/writing-modular-js</li>
<li>[3] https://github.com/addyosmani/Backbone_RequireJS or https://github.com/rauhryan/Backbone_RequireJS</li>
</ul>

