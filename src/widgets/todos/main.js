define(['sandbox', './views/app'], function(sandbox, AppView) {
  'use strict';

  return function(options) {
    new AppView({
      el: sandbox.dom.find(options.element)
    });

    sandbox.emit('initialized', 'To Do Initialized.');

    sandbox.on.log('todos');

    sandbox.on('locale.set-language', function(lang) {
      sandbox.log('Language set to: ' + lang);
      // Enclose inside tags for easy parsing via split
      window.document.cookie = 'lang=<lang>' + lang + '</lang>';
      // Reload page, as we currently rely on the i18n plugin that needs to be initialized on page load
      window.document.location.reload();
    });
  };

});
