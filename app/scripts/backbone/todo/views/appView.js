define(["text!../templates/stats.js", "../collections/todoList", "./todoView", "../mediator", "../modules"], function (statsTemplate, Todos, TodoView, mediator) {

    var AppView = Backbone.View.extend({
        el: $("#todoapp"),
        statsTemplate: function (data, options) {
            return $.tmpl(statsTemplate, data, options);
        },
        events: {
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "addingEntry",
            "click .todo-clear a": "clearCompleted"
        },

        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll', 'render');
            this.input = this.$("#new-todo");

            Todos.bind('add', this.addOne);
            Todos.bind('refresh', this.addAll);
            Todos.bind('all', this.render);

            Todos.fetch();


        },
        render: function () {
            mediator.publish('renderDone', this, Todos);
        },

        addOne: function (todo) {

            //mediator.publish('addOneTodo', this);
            var view = new TodoView({
                model: todo
            });
            this.$("#todo-list").append(view.render().el);


        },
        addAll: function () {
            Todos.each(this.addOne);

        },
        newAttributes: function () {
            return {
                content: this.input.val(),
                order: Todos.nextOrder(),
                done: false
            };
        },
        createOnEnter: function (e) {
            mediator.publish('createWhenEntered', this, e, Todos);
        },
        clearCompleted: function () {
            mediator.publish('clearContent', Todos);
            return false;
        },
        addingEntry: function (e) {

            mediator.publish('addingNewTodo', this);
        }

    });
    return AppView;

});