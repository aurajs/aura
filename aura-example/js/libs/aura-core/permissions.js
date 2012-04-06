/**
 * Permissions
 * A permissions structure can support checking
 * against subscriptions prior to allowing them
 * to clear. This enforces a flexible security
 * layer for your application.
 *
 * @example
 * // Format for permissions:
 * {eventName: {moduleName:[true|false]}, ...}
 */
define([], function () {
	
	var permissions = {
		rules: {}
	};

	/**
     * @param {string} subscriber Module name
     * @param {string} channel Event name
     */
	permissions.validate = function(subscriber, channel){
		var test = permissions.rules[channel][subscriber];
		return test === undefined ? false : test;
	};

	return permissions;
});