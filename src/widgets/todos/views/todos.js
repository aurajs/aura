define(['sandbox', 'text!../templates/todos.html', 'i18n!../../../nls/todos'], function(sandbox, todosTemplate, lang) {
  'use strict';

  return sandbox.mvc.View({

    //... is a list tag.
    tagName: 'li',

    // Cache the template function for a single item.
    template: sandbox.template.parse(todosTemplate),

    // The DOM events specific to an item.
    events: {
      'click .toggle': 'toggleCompleted',
      'dblclick .view': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `'completed'` state of the model.
    toggleCompleted: function() {
      this.model.toggle();
    },

    // Switch this view into `editing` mode, displaying the input field.
    edit: function() {
      // sandbox.dom.find(this.el).addClass('editing');
      this.$el.addClass('editing');
      this.input.focus();
    },

    // Close the `editing` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();

      if (!value) {
        this.clear();
      }
      this.model.save({
        title: value
      });
      this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode === 13) {
        this.close();
      }
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }
  });

});
