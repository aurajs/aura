define(['sandbox', 'text!../templates/controls.html'], function(sandbox, controlTemplate) {
  "use strict";

  var AppView = sandbox.mvc.View({
    controlTemplate: sandbox.template.parse(controlTemplate),

    events: {
      'click .stop-todos': 'stopTodos',
      'click .stop-calendar': 'stopCalendar',
      'click .start-todos': 'startTodos',
      'click .start-calendar': 'startCalendar',
      'click .start-all': 'startAll',
      'click .publish-data': 'publishData'
    },

    initialize: function() {
      this.$el.html(controlTemplate);
    },

    render: function() {
      //...
    },

    startAll: function() {
      sandbox.widgets.start([{
        channel: 'todos',
        element: '#todoapp'
      }, {
        channel: 'calendar',
        element: '#calendarapp'
      }]);
    },

    stopTodos: function() {
      sandbox.widgets.stop('todos', '#todoapp');
    },

    stopCalendar: function() {
      sandbox.widgets.stop('calendar', '#calendarapp');
    },

    startTodos: function() {
      sandbox.widgets.start('todos', '#todoapp');
    },

    startCalendar: function() {
      sandbox.widgets.start({
        channel: 'calendar',
        element: '#calendarapp'
      });
    },

    publishData: function() {
      sandbox.publish('bootstrap', 'calendar', 'ohai');
    }
  });

  return AppView;

});
