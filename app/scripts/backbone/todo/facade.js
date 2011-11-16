define([ "../todo/mediator" , "../todo/permissions" ], function (mediator, permissions) {

	// Facade
	var facade = facade || {};

	facade.subscribe = function(subscriber, channel, callback){
		// optional: handle persmissions
		// the conditional permissions check can be removed 
		// to just use the mediator directly.
		if(permissions.validate(subscriber, channel)){
			mediator.subscribe( channel, callback );
		}
	}

	facade.publish = function(channel){
		//optional: handle persmissions
		mediator.publush( channel );
	}

	return facade;


});