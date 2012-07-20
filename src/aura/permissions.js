/*global define*/

// ## Permissions
// A permissions structure can support checking
// against subscriptions prior to allowing them
// to clear. This enforces a flexible security
// layer for your application.
//
// {eventName: {moduleName:[true|false]}, ...}
define(['dom'], function ($) {
	
	var permissions = {},
		rules = {};
		
	permissions.extend = function (extended) {
		if (window.aura && window.aura.permissions) {
			rules = $.extend(true, {}, extended, window.aura.permissions);
		} else {
			rules = extended;
		}
	};

	// * **param:** {string} subscriber Module name
	// * **param:** {string} channel Event name
	permissions.validate = function(subscriber, channel){
		var test = rules[channel][subscriber];
		return test === undefined ? false : test;
	};

	return permissions;

});