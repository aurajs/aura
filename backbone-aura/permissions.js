// ## Permissions Extension
// @fileOverview Extend the aura-core permissions
define(["aura"], function (Aura) {

	var permissions = Aura.Permissions;

	permissions.extend({
		todos: {
			bootstrap: true,
			"new-event": true
		},
		calendar: {
			bootstrap: true
		},
		controls: {
			bootstrap: true
		}
	});

	return permissions;

});