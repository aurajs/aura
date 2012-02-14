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
	
	var obj = {};
	obj.rules = {};

	/**
     * @param {string} subscriber Module name
     * @param {string} channel Event name
     */
	obj.validate = function(subscriber, channel){
		var test = obj.rules[channel][subscriber];
		return test === undefined ? false : test;
	};

	return obj;
});