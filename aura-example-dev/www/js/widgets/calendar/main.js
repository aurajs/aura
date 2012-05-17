define(['sandbox', './views/app', './collections/events', 'fullcalendar'], function(sandbox, AppView, Events){
    return sandbox.subscribe('bootstrap', 'calendar', function (element) {
        var events = new Events();
        new AppView({el: sandbox.dom.find(element), collection: events}).render();
        events.fetch();
    });
});