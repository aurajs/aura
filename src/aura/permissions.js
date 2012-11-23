// ## Permissions
// A permissions structure can support checking
// against subscriptions prior to allowing them
// to clear. This enforces a flexible security
// layer for your application.
//
// This module houses the structure of a module's
// permission. The logic that validates and builds
// permissions are in the mediator (core.js).
//
// {eventName: {moduleName:[true|false]}, ...}
define(['dom'], function($) {
  'use strict';

  var permissions = {};
  var rules = {};

  permissions.extend = function(extended) {
    if (window.aura && window.aura.permissions) {
      rules = $.extend(true, {}, extended, window.aura.permissions);
    } else {
      rules = extended;
    }
  };

  // * **param:** {string} subscriber Module name
  // * **param:** {string} channel Event name
  permissions.validate = function(subscriber, channel) {
    if (subscriber === undefined || channel === undefined) {
      throw new Error('Subscriber and channel must be defined');
    }

    if (typeof subscriber !== 'string') {
      throw new Error('Subscriber must be a string');
    }
    if (typeof channel !== 'string') {
      throw new Error('Channel must be a string');
    }
    var channelRules = rules[channel] || {};
    var test = ('*' in channelRules) ? true : channelRules[subscriber];

    return test === undefined ? false : test;
  };

  permissions.sandboxes = function(channel) {
    var channelRules = rules[channel] || {};
    return channelRules;
  };


  return permissions;

});
