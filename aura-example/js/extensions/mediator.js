/**
 * @fileOverview Extend the aura-core mediator
 */
/*jslint sloppy:true*/
/*global define*/
define(["../libs/aura-core/mediator", "backbone", "../libs/backbone/localstorage"], 
    function (mediator, backbone, Store) {

    var Todos, Todo;

    Todo = backbone.Model.extend({

     // Default attributes for the todo.
     defaults: {
       content: "empty todo...",
       done: false
     },

     // Ensure that each todo created has `content`.
     initialize: function() {
       if (!this.get("content")) {
         this.set({"content": this.defaults.content});
       }
     },

     // Toggle the `done` state of this todo item.
     toggle: function() {
       this.save({done: !this.get("done")});
     },

     // Remove this Todo from *localStorage* and delete its view.
     clear: function() {
       this.destroy();
       this.view.remove();
     }

   });

    Todos = backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo,

        // Save all of the todo items under the `"todos"` namespace.
        localStorage: new Store("todos"),

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.filter(function(todo){ return todo.get('done'); });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.without.apply(this, this.done());
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
           if (!this.length) return 1;
           return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: function(todo) {
            return todo.get('order');
        }
    });


        mediator.data.store = Store;
        mediator.backbone = backbone;
        mediator.models = {todo: Todo};
        mediator.collections = {todos: new Todos};

        return mediator;
     });
