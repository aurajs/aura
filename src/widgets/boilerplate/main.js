define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('bootstrap', 'boilerplate');

    sandbox.on('bootstrap', 'boilerplate', function(from) {
      console.log('Boilerplate-bootstrap message from from: ' + from);
    });

    sandbox.on('*', 'calendar', function(from){
      console.log('Wildcard event from:', from);
    });

  };

});
