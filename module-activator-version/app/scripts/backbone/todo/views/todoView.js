define(["text!../templates/todo.js", "../mediator", "../modules"], function (templateText, mediator) {

    var TodoView = Backbone.View.extend({
        tagName: "li",
        template: function (data, options) {
            return $.tmpl(templateText, data, options)
        },
        events: {
            "click .check": "toggleDone",
            "dblclick div.todo-content": "edit",
            "click span.todo-destroy": "clear",
            "keypress .todo-input": "updateOnEnter"
        },
        initialize: function () {

            _.bindAll(this, 'render', this.render);
            this.model.bind('change', this.render);
            this.model.view = this;


        },

        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            mediator.publish('newContentAvailable', this);
            return this;
        },

        // Toggle the `"done"` state of the model.
        toggleDone: function () {
            this.model.toggle();
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function () {
            mediator.publish('beginContentEditing', this);
        },

        // Close the `"editing"` mode, saving changes to the todo.
        close: function () {
            mediator.publish('endContentEditing', this);
        },

        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function (e) {
            if (e.keyCode == 13) this.close();
        },

        // Remove this view from the DOM.
        remove: function () {
            $(this.el).remove();
        },

        // Remove the item, destroy the model.
        clear: function () {
            mediator.publish('destroyContent', this);
        }


    });
    return TodoView;
});