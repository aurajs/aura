define([], function () {

	// Permissions

	// A permissions structure can support checking
	// against subscriptions prior to allowing them 
	// to clear. This enforces a flexible security 
	// layer for your application.

	var permissions = {

		newContentAvailable: {
			contentUpdater:true
		},

		endContentEditing:{
			todoSaver:true
		},

		beginContentEditing:{
			editFocus:true
		},

		addingNewTodo:{
			todoTooltip:true
		},

		clearContent:{
			garbageCollector:true
		},

		renderDone:{
			todoCounter:true 
			//switch to false and you'll notice that this
			//component is effectively no longer rendered
			//in the application as it hasn't passed
			//the facade security/permissions clearance
		},

		destroyContent:{
			todoRemover:true
		},

		createWhenEntered:{
			keyboardManager:true
		}

	};

	permissions.validate = function(subscriber, channel){
		var test = permissions[channel][subscriber];
		return test===undefined? false: test;
	};


	return permissions;

});