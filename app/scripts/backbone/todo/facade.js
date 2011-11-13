define([ "../todo/mediator" , "../todo/permissions" ], function (mediator, permissions) {

	// Facade

	var facade = facade || {};

	facade.subscribe = function(channel, subscription){
		//optional: handle persmissions
		//if(permissions.validate)
		mediator.subscribe( channel, subscription );
	}

	facade.publish = function(channel){
		//optional: handle persmissions
		mediator.publush( channel );
	}

	return facade;


});