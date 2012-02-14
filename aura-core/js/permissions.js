/**
 * Extend core permissions
 */
define(["./core/permissions"], function (permissions) {
	
	permissions.rules.appInit = {bootstrap:true};
	return permissions;
});