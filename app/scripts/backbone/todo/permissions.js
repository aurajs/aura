define([], function () {

	// Permissions

	// A permissions structure can check
	// against subscriptions prior to allowing
	// them to clear. This enforces a light 
	// security layer for your application.

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
			todoCounter:false
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
		console.log(test);
		return test===undefined? false: test;
	};


	return permissions;

});