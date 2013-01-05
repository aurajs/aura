// ## Permissions Extension
// @fileOverview Extend the aura-core permissions
define(['aura_perms'], function(permissions) {
  'use strict';

  permissions.extend({
    todos: {
      'bootstrap': true,
      'new-event': true,
      'set-language': true,
      'route': true
    },
    calendar: {
      'bootstrap': true,
      'route': true
    },
    controls: {
      '*': true
    },
    router: {
      '*': true
    }
  });

  return permissions;
});
