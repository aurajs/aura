define(['sandbox', 'text!../templates/todos.html'], function(sandbox, todosTemplate){
    return sandbox.mvc.View({

        //... is a list tag.
        tagName:  "li",
    
        // Cache the template function for a single item.
        template: sandbox.template.parse(todosTemplate),
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleDone",
          "dblclick div.todo-content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .todo-input"      : "updateOnEnter",
          "blur .todo-input"          : "close"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
          sandbox.events.bindAll(this, 'render', 'close', 'remove');
          this.model.bind('change', this.render);
          this.model.bind('destroy', this.remove);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          sandbox.dom.find(this.el).html(this.template(this.model.toJSON()));
          this.input = sandbox.dom.find('.todo-input'); // @todo
          return this;
        },
    
        // Toggle the `"done"` state of the model.
        toggleDone: function() {
          this.model.toggle();
        },
    
        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
          sandbox.dom.find(this.el).addClass("editing");
          this.input.focus();
        },
    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
          this.model.save({content: this.input.val()});
          sandbox.dom.find(this.el).removeClass("editing");
        },
    
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
          if (e.keyCode == 13) this.close();
        },
    
        // Remove the item, destroy the model.
        clear: function() {
          this.model.clear();
        }

    });
});
