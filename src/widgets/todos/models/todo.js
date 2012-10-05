define(['sandbox'], function(sandbox) {
  'use strict';

  var TodoModel = sandbox.mvc.Model({

    // Default attributes for the todo.
    defaults: {
      title: '',
      completed: false
    },

    // Ensure that each todo created has `title`.
    initialize: function() {
      if (!this.get('title')) {
        this.set({
          'title': this.defaults.title
        });
      }
    },

    // Toggle the `completed` state of this todo item.
    toggle: function() {
      this.save({
        completed: !this.get('completed')
      });
    },

    // Remove this Todo from *localStorage*.
    clear: function() {
      this.destroy();
    }

  });

  return TodoModel;

});
