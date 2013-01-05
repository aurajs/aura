define(['sandbox', 'text!../templates/controls.html'], function(sandbox, controlTemplate) {
  'use strict';

  var AppView = sandbox.mvc.View({
    controlTemplate: sandbox.template.parse(controlTemplate),

    events: {
      'click .stop-todos': 'stopTodos',
      'click .stop-calendar': 'stopCalendar',
      'click .start-todos': 'startTodos',
      'click .start-calendar': 'startCalendar',
      'click .start-all': 'startAll',
      'click .emit-data': 'emitData',
      'change .language': 'setLanguage'
    },

    initialize: function() {
      this.$el.html(controlTemplate);
      this.$el.find('.language').val(require.aura.locale);
    },

    render: function() {
      //...
    },

    startAll: function() {
      sandbox.widgets.start({
        todos: {
          options: {
            element: '#todoapp'
          }
        },
        calendar: {
          options: {
            element: '#calendarapp'
          }
        }
      });
    },

    stopTodos: function() {
      sandbox.widgets.stop('todos', '#todoapp');
    },

    stopCalendar: function() {
      sandbox.widgets.stop('calendar', '#calendarapp');
    },

    startTodos: function() {
      sandbox.widgets.start({
        'todos': {
          options: {
            element: '#todoapp'
          }
        }
      });
    },

    startCalendar: function() {
      sandbox.widgets.start({
        'calendar': {
          options: {
            element: '#calendarapp'
          }
        }
      });
    },

    emitData: function() {
      sandbox.emit('calendar', 'ohai');
    },

    setLanguage: function() {
      // Potentially widgets can listen to this event to re-render themselves without a browser refresh
      sandbox.emit('locale.set-language', this.$el.find(".language").val());
    }
  });

  return AppView;

});
