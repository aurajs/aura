// ## Permissions Extension
// @fileOverview Extend the aura-core permissions
define(['aura_perms'], function(permissions) {
  'use strict';

  permissions.extend({
    todos: {
      bootstrap: true,
      'new-event': true,
      'set-language': true,
      '*': true
    },
    calendar: {
      bootstrap: true,
      '*': true
    },
    controls: {
      bootstrap: true,
      '*': true
    },
    router: {
      bootstrap: true,
      router: true,
      calendar: true,
      todos: true,
      '*': true
    }
  });

  return permissions;
});
