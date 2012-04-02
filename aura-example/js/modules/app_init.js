define(["../extensions/facade", "text!../templates/stats.html"], 
    function (facade, statsTemplate) {
    return facade.subscribe('bootstrap', 'appInit', function (element) {
        console.log("modules/app_init loaded.");
        var AppView = this.backbone.View.extend({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: facade.dom.find(element),

            // Our template for the line of statistics at the bottom of the app.
            statsTemplate: statsTemplate,

            // Delegated events for creating new items, and clearing completed ones.
            events: {
                "keypress #new-todo":  "createOnEnter",
                "keyup #new-todo" : "addEntry",
                "click .todo-clear a": "clearCompleted"
            },

            // At initialization we bind to the relevant events on the `Todos`
            // collection, when items are added or changed. Kick things off by
            // loading any preexisting todos that might be saved in *localStorage*.
            initialize: function() {
                facade.events.bindAll(this, 'addOne', 'addAll', 'render');

                this.input    = facade.dom.find("#new-todo", this.el);

                facade.collections.todos.bind('add',     this.addOne);
                facade.collections.todos.bind('reset',   this.addAll);
                facade.collections.todos.bind('all',     this.render);

                facade.collections.todos.fetch();
            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function() {
                facade.publish('renderDone', this, facade.collections.todos);
            },

            // Add a single todo item to the list by creating a view for it, and
            // appending its element to the `<ul>`.
            // Should just publish an event that lets the todo view handle the display
            addOne: function(todo) {
                // var view = new TodoView({model: todo});
                // this.$("#todo-list").append(view.render().el);
                facade.publish('newTodo', this, todo);
            },

            // Add all items in the **Todos** collection at once.
            addAll: function() {
                facade.collections.todos.each(this.addOne);
            },

            // Generate the attributes for a new Todo item.
            newAttributes: function() {
                return {
                    content: this.input.val(),
                    order:   facade.collections.todos.nextOrder(),
                    done:    false
                };
            },

            // If you hit return in the main input field, create new **Todo** model,
            // persisting it to *localStorage*.
            createOnEnter: function(e) {
                facade.publish('createWhenEntered', this, e, facade.collections.todos);
                console.log("createOnEnter triggered, publish event");
            },

            // Clear all done todo items, destroying their models.
            clearCompleted: function() {
                facade.publish('clearContent', facade.collections.todos);
                return false;
            },

            addEntry:function(){
                facade.publish('addingNewTodo', this);
                console.log("addEntry triggered, publish event");
            }

        });
        new AppView;
    });
});
