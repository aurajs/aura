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
      'click .emit-data': 'emitData'
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
        options: {
          element: '#todoapp'
        }
      }, {
        channel: 'calendar',
        options: {
          element: '#calendarapp'
        }
      }]);
    },

    stopTodos: function() {
      sandbox.widgets.stop('todos', '#todoapp');
    },

    stopCalendar: function() {
      sandbox.widgets.stop('calendar', '#calendarapp');
    },

    startTodos: function() {
      sandbox.widgets.start('todos', { element: '#todoapp' });
    },

    startCalendar: function() {
      sandbox.widgets.start({
        channel: 'calendar',
        options: {
          element: '#calendarapp'
        }
      });
    },

    emitData: function() {
      sandbox.emit('bootstrap', 'calendar', 'ohai');
    }
  });

  return AppView;

});
