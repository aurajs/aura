A Todo application using:

<ul>
<li>The mediator pattern for centralized Pub/Sub</li>
<li>RequireJS</li>
<li>AMD modules</li>
<li>Backbone.js & Underscore.js</li>
<li>jQuery 1.7</li>
<li>Templating via jQuery.tmpl</li>
</ul>

The most important part of this application can be found in the <code>scripts/backbone/todo</code> directory. This contains the AMD formatted models, views and collections needed. 

It also contains the mediator (mediator.js) providing pub/sub and a modules.js file containing subscribers consuming events broadcast (published) from the views.

For more information on writing applications using AMD modules see:
http://addyosmani.com/writing-modular-js

Based on portions by Ryan Rauh.