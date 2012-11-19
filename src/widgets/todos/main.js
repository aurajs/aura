define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('bootstrap', 'todos');
    sandbox.on('bootstrap', function(from) {
      sandbox.log('Todos-bootstrap message from: ' + from);
    });
  };

});
