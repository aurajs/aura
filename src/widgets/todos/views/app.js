define(['sandbox', '../collections/todos', './todos', 'text!../templates/base.html', 'text!../templates/stats.html'], function(sandbox, Todos, TodoView, baseTemplate, statsTemplate) {
  "use strict";

  var AppView = sandbox.mvc.View({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    // el: sandbox.dom.find('#todoapp'),
    // Our base for the rest of the Todos widget
    baseTemplate: sandbox.template.parse(baseTemplate),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: sandbox.template.parse(statsTemplate),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.$el.html(baseTemplate);
      this.input = this.$('#new-todo');
      this.allCheckbox = this.$('#toggle-all')[0];

      Todos.bind('add', this.addOne, this);
      Todos.bind('reset', this.addAll, this);
      Todos.bind('all', this.render, this);
      sandbox.subscribe('new-event', 'todos', this.addEvent);

      Todos.fetch();
    },
    addEvent: function(object) {
      Todos.create({
        title: object.title,
        order: Todos.nextOrder(),
        completed: false
      });
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var completed = Todos.completed().length;
      var remaining = Todos.remaining().length;

      this.$('#footer').html(this.statsTemplate({
        total: Todos.length,
        completed: completed,
        remaining: remaining
      }));
      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({
        model: todo
      });
      this.$('#todo-list').append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne.bind(this));
    },

    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        title: this.input.val(),
        order: Todos.nextOrder(),
        completed: false
      };
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode !== 13) {
        return;
      }
      if (!this.input.val()) {
        return;
      }

      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // Clear all compelted todo items, destroying their models.
    clearCompleted: function() {
      sandbox.util.each(Todos.completed(), function(todo) {
        todo.clear();
      });

      return false;
    },

    // Change each todo so that it's `completed` state matches the check all
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      Todos.each(function(todo) {
        todo.save({
          'completed': completed
        });
      });
    }
  });

  return AppView;

});
