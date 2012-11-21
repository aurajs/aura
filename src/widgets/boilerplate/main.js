define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('bootstrap', 'boilerplate');

    sandbox.on('bootstrap', function(from) {
      sandbox.log('Boilerplate-bootstrap message from: ' + from);
    });

    sandbox.on('*', function(from){
      sandbox.log('Wildcard event from:', from);
    });

  };

});
