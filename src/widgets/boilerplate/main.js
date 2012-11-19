define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('bootstrap', 'boilerplate');

    sandbox.on('bootstrap', 'boilerplate', function(from) {
      sandbox.log('Boilerplate-bootstrap message from: ' + from);
    });

    sandbox.on('*', 'calendar', function(from){
      sandbox.log('Wildcard event from:', from);
    });

  };

});
