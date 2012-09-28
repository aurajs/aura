define(['sandbox', './views/app'], function(sandbox, AppView) {
  "use strict";

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.publish('bootstrap', 'controls');
    sandbox.subscribe('bootstrap', 'controls', function(from) {
      console.log('Controls-bootstrap message from from: ' + from);
    });
  };

});
