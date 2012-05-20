define(['sandbox', '../collections/todos', './todos', 'text!../templates/stats.html'],
        function(sandbox, Todos, TodoView, statsTemplate) {

    var AppView = sandbox.mvc.View({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        // el: sandbox.dom.find("#todoapp"),

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: sandbox.template.parse(statsTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
          "keypress #new-todo":  "createOnEnter",
          "click .todo-clear a": "clearCompleted",
          "click .mark-all-done": "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {
         
         this.input = this.$("#new-todo"); 
         this.allCheckbox = this.$(".mark-all-done")[0]; 

          Todos.bind('add', this.addOne, this);
          Todos.bind('reset', this.addAll, this);
          Todos.bind('all', this.render, this);

          Todos.fetch();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
          var done = Todos.done().length;
          var remaining = Todos.remaining().length;

          this.$('#todo-stats').html(this.statsTemplate({
            total:      Todos.length,
            done:       done,
            remaining:  remaining
          }));

          this.allCheckbox.checked = !remaining;
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(todo) {
          var view = new TodoView({model: todo});
          this.$('#todo-list').append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function() {
          Todos.each(this.addOne);
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function() {
          return {
            content: this.input.val(),
            order:   Todos.nextOrder(),
            done:    false
          };
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
          if (e.keyCode != 13) return;
          if (!this.input.val()) return;
          Todos.create(this.newAttributes());
          this.input.val('');
        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
          sandbox.util.each(Todos.done(), function(todo){ todo.clear(); });
          return false;
        },

        // Change each todo so that it's `done` state matches the check all
        toggleAllComplete: function () {
          var done = this.allCheckbox.checked;
          Todos.each(function (todo) { todo.save({'done': done}); });
        }

    });
    
    return AppView;

});
