define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('initialized', 'Initialized Boilerplate.');

    sandbox.on.log('initialized');

  };

});
