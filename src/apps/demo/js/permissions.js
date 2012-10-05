// ## Permissions Extension
// @fileOverview Extend the aura-core permissions
define(['aura_perms'], function(permissions) {
  'use strict';

  permissions.extend({
    todos: {
      bootstrap: true,
      'new-event': true,
      '*': true
    },
    calendar: {
      bootstrap: true,
      '*': true
    },
    controls: {
      bootstrap: true,
      '*': true
    }
  });

  return permissions;
});
