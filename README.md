A Todo application using:

<ul>
<li>The mediator pattern for centralized Pub/Sub</li>
<li>RequireJS</li>
<li>AMD modules</li>
<li>Backbone.js & Underscore.js</li>
<li>jQuery 1.7</li>
<li>Templating via jQuery.tmpl</li>
</ul>

The most important part of this application can be found in the <code>app/scripts/backbone/todo</code> directory. This contains the AMD formatted models, views and collections needed. It also contains the mediator (mediator.js) providing pub/sub and a modules.js file containing subscribers consuming events broadcast (published) from the views.

<code>app/scripts/util</code> contains a set of helpers for module loading and execution. Note that whilst this demo does use these helpers, this *isn't* absolutely required for successfully creating Backbone applications using AMD modules. For an alternative approach to this, see [1].

For more information on writing applications using AMD modules see [2]

Based on portions by Ryan Rauh [3]

[1] http://backbonetutorials.com/organizing-backbone-using-modules/
[2] http://addyosmani.com/writing-modular-js
[3] https://github.com/rauhryan/Backbone_RequireJS