define(["../extensions/facade", "text!../templates/stats.html"], 
    function (facade, statsTemplate) {
    return facade.subscribe('bootstrap', 'appInit', function (element) {

        var AppView = this.mvc.createView({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: facade.dom.find(element),

            // Our template for the line of statistics at the bottom of the app.
            statsTemplate: statsTemplate,

            // Delegated events for creating new items, and clearing completed ones.
            events: {
                "keypress #new-todo":  "createOnEnter",
                "click .todo-clear a": "clearCompleted"
            },

            // At initialization we bind to the relevant events on the `Todos`
            // collection, when items are added or changed. Kick things off by
            // loading any preexisting todos that might be saved in *localStorage*.
            initialize: function() {
                var self = this;

                facade.events.bindAll(this, 'addOne', 'addAll', 'render');

                this.input = facade.dom.find("#new-todo", this.el);

                facade.mvc.getCollection("todos").then(function (todos) {
                    self.todos = todos;
                    self.todos.bind('add', this.addOne);
                    self.todos.bind('reset', this.addAll);
                    self.todos.bind('all', this.render);
                    self.todos.fetch();
                });
            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function() {
                facade.publish('renderDone', this, this.todos);
            },

            // Add a single todo item to the list by creating a view for it, and
            // appending its element to the `<ul>`.
            // Should just publish an event that lets the todo view handle the display
            addOne: function(todo) {
                facade.publish('newTodo', this, todo);
            },

            // Add all items in the **Todos** collection at once.
            addAll: function() {
                this.todos.each(this.addOne);
            },

            // Generate the attributes for a new Todo item.
            newAttributes: function() {
                return {
                    content: this.input.val(),
                    order:   this.todos.nextOrder(),
                    done:    false
                };
            },

            // If you hit return in the main input field, create new **Todo** model,
            // persisting it to *localStorage*.
            createOnEnter: function(e) {
                if (e.keyCode != 13) return;
                
                // this.todos.create(this.newAttributes());
                facade.publish('newTodo', this, this.newAttributes());

                this.input.val('');
            },

            // Clear all done todo items, destroying their models.
            clearCompleted: function() {
                facade.publish('clearContent', this.todos);
                return false;
            }

        });
        new AppView;
    });
});
