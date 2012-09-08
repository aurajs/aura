define(['sandbox', './views/app', './collections/events', 'fullcalendar'], function(sandbox, AppView, Events) {
  "use strict";

  return function(element) {
    var events = new Events();

    new AppView({
      el: sandbox.dom.find(element),
      collection: events
    }).render();

    events.fetch();



    sandbox.emit('bootstrap', 'calendar');
    sandbox.emit('*', 'calendar', 'bubblegum');
    sandbox.on('bootstrap', 'calendar', function(from, data) {
      console.log('Calendar-bootstrap message from from: ' + from);
      console.log('Additional data:', data);
      sandbox.emit('*','controls');
    });
  };

});
