define(['sandbox', './views/app', './collections/events', 'fullcalendar'], function(sandbox, AppView, Events) {
  'use strict';

  return function(options) {
    var events = new Events();

    new AppView({
      el: sandbox.dom.find(options.element),
      collection: events
    }).render();

    events.fetch();



    sandbox.emit('bootstrap', 'calendar');
    sandbox.emit('*', 'calendar', 'bubblegum');
    sandbox.on('bootstrap', function(from, data) {
      sandbox.log('Calendar-bootstrap message from: ' + from);
      sandbox.log('Additional data:', data);
      sandbox.emit('*','controls');
    });
  };

});
