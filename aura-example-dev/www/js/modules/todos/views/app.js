define(['sandbox', '../collections/todos', './todos', 'text!../templates/stats.html'],
        function(sandbox, Todos, TodoView, statsTemplate) {

    return function (element) {
        return new sandbox.mvc.View({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: sandbox.dom.find(element),

            // Our template for the line of statistics at the bottom of the app.
            statsTemplate: sandbox.template.parse(statsTemplate),

            // Delegated events for creating new items, and clearing completed ones.
            events: {
              "keypress #new-todo":  "createOnEnter",
              "keyup #new-todo":     "showTooltip",
              "click .todo-clear a": "clearCompleted",
              "click .mark-all-done": "toggleAllComplete"
            },

            // At initialization we bind to the relevant events on the `Todos`
            // collection, when items are added or changed. Kick things off by
            // loading any preexisting todos that might be saved in *localStorage*.
            initialize: function() {
              console.log("init called");
              sandbox.events.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');

              this.input    = sandbox.dom.find("#new-todo", this.el);
              this.allCheckbox = sandbox.dom.find(".mark-all-done", this.el)[0];

              Todos.bind('add',     this.addOne);
              Todos.bind('reset',   this.addAll);
              Todos.bind('all',     this.render);

              Todos.fetch();
            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function() {
              var done = Todos.done().length;
              var remaining = Todos.remaining().length;

              sandbox.find('#todo-stats', this.el).html(this.statsTemplate({
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
              this.sandbox.find("#todo-list", this.el).append(view.render().el);
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
              Todos.create(this.newAttributes());
              this.input.val('');
            },

            // Clear all done todo items, destroying their models.
            clearCompleted: function() {
              sandbox.util.each(Todos.done(), function(todo){ todo.clear(); });
              return false;
            },

            // Lazily show the tooltip that tells you to press `enter` to save
            // a new todo item, after one second.
            showTooltip: function() {
              var tooltip = sandbox.dom.find(".ui-tooltip-top", this.el);
              var val = this.input.val();
              tooltip.fadeOut();
              if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
              if (val === '' || val === this.input.attr('placeholder')) return;
              var show = function(){ tooltip.show().fadeIn(); };
              this.tooltipTimeout = sandbox.util.delay(show, 1000);
            },

            // Change each todo so that it's `done` state matches the check all
            toggleAllComplete: function () {
              var done = this.allCheckbox.checked;
              Todos.each(function (todo) { todo.save({'done': done}); });
            }

        });
    };
});
