define(['sandbox', '../collections/todos', './todos', 'text!../templates/base.html', 'text!../templates/stats.html', 'i18n!../../../nls/todos'], function(sandbox, Todos, TodoView, baseTemplate, statsTemplate, lang) {
  'use strict';

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
      'click #toggle-all': 'toggleComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.$el.html(this.baseTemplate(lang));
      this.input = this.$('#new-todo');
      this.allCheckbox = this.$('#toggle-all')[0];

      Todos.bind('add', this.addOne, this);
      Todos.bind('reset', this.addAll, this);
      Todos.bind('all', this.render, this);
      sandbox.on('schedule.new-event', this.addEvent, this);

      sandbox.on('route.todos.**', this.todoController, this);

      Todos.fetch();
    },

    todoController: function() {
      var action;
      var args = Array.prototype.slice.call(arguments, 1); // strip off 'calendar'

      if (typeof(args) === 'string') {
        action = args;
      }
      action = args[0];

      if (action === 'filter') {
        // #todos/filter/<string> to filter checkboxes to match todo item title
        this.toggleItemsComplete(args[1], false);
      } else if (action === 'select') {
        // #todos/select/<string> to add checkboxes matching todo title
        this.toggleItemsComplete(args[1], true);
      } else if (action === 'checkAll') {
        // #todos/checkAll
        this.toggleComplete(true);
      } else if (action === 'uncheckAll') {
        // #todos/uncheckAll
        this.toggleComplete(false);
      }
    },

    toggleItemsComplete: function(string, append) {
      if (!append) { // if not appended, uncheck all via collection
        Todos.each(function(todo) {
          todo.save({
            'completed': false
          });
        });
      }

      // Iterate through todo items matching filter string
      Todos.chain().filter(function(models) {
        return models.get('title') === string;
      }).each(function(todo) {
        todo.save({
          'completed': true
        });
      });
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
        remaining: remaining,
        clear: lang.clear,
        completedSingular: lang.completedSingular,
        completedPlural: lang.completedPlural,
        itemsLeft: lang.itemsLeft,
        itemSingular: lang.itemSingular,
        itemPlural: lang.itemPlural
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
      sandbox.util.each(Todos.completed(), function(index, todo) {
        todo.clear();
      });

      return false;
    },

    // Toggle todo so state matches the check all event, or stateVal
    // passed in via argument.
    toggleComplete: function(stateVal) {
      // If boolean argument passed, use it. Or else it's event, check DOM (this.AllCheckbox) then.
      var completed = ($.type(stateVal) === 'boolean') ? stateVal : this.allCheckbox.checked;

      Todos.each(function(todo) {
        todo.save({
          'completed': completed
        });
      });
    }
  });

  return AppView;

});
