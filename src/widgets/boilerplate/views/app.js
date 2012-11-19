define(['sandbox', 'text!../templates/sample.html'], function(sandbox, sampleTemplate) {
  'use strict';

  /*
    * Welcome to this boilerplate Aura widget
    * The utilities you have access to include:
    *
    * sandbox.emit(channel, widget, data)
    * e.g sandbox.emit('bootstrap', 'calendar', 'hi there!')
    *
    * sandbox.on(channel, callback)
    * e.g sandbox.on('bootstrap', function(from) { ... }
    *
    * sandbox.widgets.start(channel, options)
    * where channel is a widget and
    * options.element is a DOM element for a widget
    * e.g sandbox.widgets.start('calendar', { element: '#cal' });
    *
    * sandbox.widgets.stop(widget, el)
    * e.g sandbox.widgets.stop('calendar', '#cal');
    *
    * as well as:
    * sandbox.util.*
    * e.g sandbox.util.each(..))
    * sandbox.util.extend(..) etc.
    * and
    * sandbox.template(..)
    *
  */

  var AppView = sandbox.mvc.View({
    sampleTemplate: sandbox.template.parse(sampleTemplate),

    events: {
    },

    initialize: function() {
      this.$el.html(sampleTemplate);
    },

    render: function() {
      //...
    }
  });

  return AppView;

});
