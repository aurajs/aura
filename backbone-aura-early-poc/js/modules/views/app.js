define(["../facade"], function(facade){
    // @todo: return function in facade and mediator, simply call function in
    // mediator.publish?
    return facade.subscribe('bootstrap', 'views.appInit', function (element) {
        var el,
            view;

        el = this.dom.find(element),
        view = this.backbone.View.extend({
            el: el, 
            events: {
                "keypress #new-action-form .action-text": "keyCheck",
                "click #new-action-form .action-save": "save",
                "submit #new-action-form ": "save"
            },
            keyCheck: function (e) {
                // if (e.keyCode === 13) { // Enter
                //     this.save(e);
                // }
            },
            save: function (e) {
                // e.preventDefault();
                // var params = this.$("#new-action-form").formParams();
                // this.actions.create(params);
            },
            renderOne: function (model) {
                // var view = new App.ActionView({model: model});
                // this.$("#actions-list").prepend(view.render().el);
            },
            render: function (collection, response) {
                // _.each(collection.models, function (model) {
                //     this.renderOne(model);
                // }, this);
            },
            initialize: function () {

                // this.actions = new App.ActionList();
                // this.projects = new App.ProjectList();
                // this.contexts = new App.ContextList();

                // this.actions.bind("reset", function (collection, options) {
                //     this.render(collection);
                // }, this);

                // this.actions.bind("add", function (model, options) {
                //     this.renderOne(model);
                //     this.$("#new-action-form").clearForm();
                // }, this);

                // var self = this;
                // this.$(".action-text").autocomplete({
                //     focus: function(event, ui) {
                //         return false;
                //     },
                //     select: function(event, ui) {
                //         this.value += ui.item.value.substring(1);
                //         return false;
                //     },
                //     source: function (request, response) {
                //         console.log();
                //         var last = request.term.charAt(request.term.length - 1);
                //         if (last === "@") {
                //             response(self.contexts.labels());
                //         } else if (last === "+") {
                //             response(self.projects.labels());
                //         } else {
                //             response([]);
                //         }
                        
                //     }
                // })

                // this.$(".action-save").button();

                // Hrm.
                //
                // "Note that fetch should not be used to populate
                // collections on page load — all models needed at
                // load time should already be bootstrapped in to
                // place. fetch is intended for lazily-loading models
                // for interfaces that are not needed immediately:
                // for example, documents with collections of notes
                // that may be toggled open and closed."
                //
                // Personal note regarding this: "bootstrapped"
                // means dumping the object to the page and reading
                // it in.
                // this.actions.fetch();
                // this.projects.fetch();
                // this.contexts.fetch();
            }
        });
    });
});