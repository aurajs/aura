define(['sandbox', './views/app'], function(sandbox, AppView) {
  "use strict";

  return function(element) {
    new AppView({
      el: sandbox.dom.find(element)
    });

    sandbox.emit('bootstrap', 'controls');

    sandbox.on('bootstrap', 'controls', function(from) {
      console.log('Controls-bootstrap message from from: ' + from);
    });
    sandbox.on('*', 'calendar', function(from){
      console.log('WILCARD OMG', from);
    });

  };

});
