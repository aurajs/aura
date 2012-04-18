define(["../facade"], function (facade) {
    // @todo: return function in facade and mediator, simply call function in
    // mediator.publish?
    return facade.subscribe('bootstrap', 'appInit', function (element) {
        var self = this,
            app = this.dom.find(element);
        this.events.listen(app, "click", "a", function (e) {
            console.log("Element clicked");
            self.events.queue();
        });
    });
});